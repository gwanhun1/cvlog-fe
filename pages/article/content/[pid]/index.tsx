import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { GetStaticProps, GetStaticPaths, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import removeMarkdown from 'markdown-to-text';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from 'components/Shared';
import CommentBox from 'components/Shared/LogmeComment';
import ShareButtons from 'components/Shared/ShareButtons';
import ReadingProgressBar from 'components/Shared/ReadingProgressBar';
import { getReadingTimeMinutes } from 'utils/readingTime';
import SeriesNav from 'components/Shared/SeriesNav';
import { useGetDetail, useDeleteDetail, usePatchDetail } from 'service/hooks/Detail';
import {
  Content as ContentLayout,
  Profile,
  PostNavigation,
  RelatedPosts,
  LikeButton,
} from '../../../../components/pages/article/content';
import { useStore } from 'service/store/useStore';
import LocalStorage from 'public/utils/Localstorage';
import { incrementViewCount } from 'service/api/detail';
import type { ContentData, TagType } from 'service/api/detail/type';

interface DetailProps {
  pid: string;
  initialData?: {
    post: ContentData;
    prevPostInfo: { id: number; title: string } | null;
    nextPostInfo: { id: number; title: string } | null;
  } | null;
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const pidParam = context.params?.pid;
  const pid = Array.isArray(pidParam) ? pidParam[0] : pidParam;

  if (!pid) return { notFound: true };

  // 서버사이드(ISR)에서는 BE 직통 주소를 우선 사용 (자기 자신 프록시(/api) 호출 방지)
  const API_URL =
    process.env.API_SERVER_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'http://localhost:8000';

  try {
    const response = await fetch(`${API_URL}/posts/${pid}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    // 비공개 글(403)이면 initialData null로 내려보내 클라이언트가 인증 토큰으로 재시도
    if (!response.ok) {
      return { props: { pid, initialData: null }, revalidate: 60 };
    }

    const responseData = await response.json();

    if (!responseData?.data?.post) {
      return { props: { pid, initialData: null }, revalidate: 60 };
    }

    return {
      props: { pid, initialData: responseData.data },
      revalidate: 60,
    };
  } catch {
    return { props: { pid, initialData: null }, revalidate: 60 };
  }
};

const Detail: NextPage<DetailProps> = ({ pid: propsPid, initialData }) => {
  const router = useRouter();
  const pid = propsPid || (router.query.pid as string);
  const queryClient = useQueryClient();
  const { showToast, showConfirm } = useToast();

  const userInfo = useStore(state => state.userIdAtom);
  const setTagList = useStore(state => state.setTagListAtom);
  const selectTagList = useStore(state => state.selectedTagListAtom);
  const setSelectTagList = useStore(state => state.setSelectedTagListAtom);

  const [patchMessage, setPatchMessage] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [viewCount, setViewCount] = useState<number | null>(initialData?.post?.view_count ?? null);
  const viewCountFired = useRef(false);

  const { data: detailData, isLoading } = useGetDetail(parseInt(pid), initialData ?? undefined);

  useEffect(() => {
    if (detailData?.post) {
      setPatchMessage(detailData.post.public_status);
      setTagList(detailData.post.tags);
      if (viewCount === null) {
        setViewCount(detailData.post.view_count ?? 0);
      }
    }
  }, [detailData, setTagList]);

  useEffect(() => {
    if (!pid || viewCountFired.current) return;
    const postId = parseInt(pid);
    if (isNaN(postId)) return;
    const isPublic = detailData?.post?.public_status ?? initialData?.post?.public_status;
    if (isPublic === undefined) return;
    if (!isPublic) return;
    viewCountFired.current = true;
    incrementViewCount(postId)
      .then(res => setViewCount(res.view_count))
      .catch(() => {});
  }, [pid, detailData, initialData]);

  const patchDetailMutation = usePatchDetail();

  const handlePrivateToggle = useCallback(async () => {
    if (isToggling) return;
    setIsToggling(true);
    const newPublicStatus = !patchMessage;
    try {
      await patchDetailMutation.mutateAsync({ id: parseInt(pid), public_status: newPublicStatus });
      setPatchMessage(newPublicStatus);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['detail', parseInt(pid)] }),
        queryClient.invalidateQueries({ predicate: q => q.queryKey[0] === 'publicList' }),
        queryClient.invalidateQueries({ predicate: q => q.queryKey[0] === 'list' }),
      ]);
      showToast(
        newPublicStatus ? '이 게시물은 전체에게 보입니다.' : '이 게시물은 "나만보기"가 설정 되었습니다.',
        'success',
      );
    } catch {
      showToast('상태 변경 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsToggling(false);
    }
  }, [isToggling, patchMessage, pid, patchDetailMutation, queryClient, showToast]);

  const deleteContent = useDeleteDetail(parseInt(pid));

  const deleteCheck = useCallback(() => {
    if (isDeleting) return;
    showConfirm('삭제하시겠습니까?', async () => {
      setIsDeleting(true);
      try {
        await deleteContent.mutateAsync();
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['tagsFolder'] }),
          queryClient.invalidateQueries({ predicate: q => q.queryKey[0] === 'list' }),
          queryClient.invalidateQueries({ predicate: q => q.queryKey[0] === 'publicList' }),
        ]);
        showToast('삭제되었습니다.', 'success');
        router.push('/article');
      } catch {
        showToast('삭제 중 오류가 발생했습니다.', 'error');
        setIsDeleting(false);
      }
    });
  }, [isDeleting, deleteContent, queryClient, showToast, showConfirm, router]);

  const handleTagSelect = useCallback(
    (tag: TagType) => {
      const exists = selectTagList.some(item => item.id === tag.id);
      setSelectTagList(
        exists ? selectTagList.filter(item => item.id !== tag.id) : [...selectTagList, tag],
      );
    },
    [selectTagList, setSelectTagList],
  );

  // 소유자 판단은 저장된 유저 정보만 믿지 않고 실제 토큰 보유까지 확인한다.
  // (세션 만료 후 스토어에 유저 정보만 남는 경우 소유자 UI가 잘못 노출되는 것 방지)
  const [hasToken, setHasToken] = useState(false);
  useEffect(() => {
    setHasToken(!!LocalStorage.getItem('LogmeToken'));
  }, []);

  const resolvedData = detailData || initialData;
  const shouldShowSkeleton = isLoading && !initialData;
  const postData = resolvedData?.post;
  const isOwner =
    hasToken &&
    !!postData &&
    (Number(userInfo?.id) === postData.user?.id ||
      userInfo?.github_id === String(postData.user?.github_id));

  const postTitle = postData?.title || 'LOGME 게시물';
  const postDescription = useMemo(() => {
    const content = postData?.content;
    if (!content) return 'LOGME 블로그의 게시물입니다.';
    const plain = removeMarkdown(content).replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
    return plain.length > 155 ? plain.substring(0, 155) + '...' : plain;
  }, [postData?.content]);

  const postImage = useMemo(() => {
    const content = postData?.content;
    if (!content) return 'https://logme.cloud/assets/logo.png';
    const md = content.match(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/);
    if (md) return md[1];
    const html = content.match(/<img[^>]+src=["'](https?:\/\/[^\s"']+)["']/);
    if (html) return html[1];
    return 'https://logme.cloud/assets/logo.png';
  }, [postData?.content]);

  const readingMinutes = useMemo(
    () => getReadingTimeMinutes(postData?.content),
    [postData?.content],
  );

  if (!shouldShowSkeleton && !resolvedData?.post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="mb-4 text-2xl font-bold text-gray-700">게시물을 찾을 수 없습니다.</div>
        <div className="mb-8 text-gray-500">삭제되었거나 비공개된 게시물일 수 있습니다.</div>
        <Link href="/article" className="px-6 py-2 text-white bg-ftBlue rounded-lg transition-colors hover:bg-[#1f4a8c]">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const canonicalUrl = `https://logme.cloud/article/content/${pid}`;
  const isPublic = postData?.public_status ?? false;

  return (
    <div className="flex flex-col items-center gap-6 pb-12 w-full">
      <ReadingProgressBar />
      {/* 뒤로가기 + owner 버튼 상단 바 */}
      <div className="flex justify-between items-center w-full pt-2">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-500 rounded-lg hover:bg-gray-100 hover:text-ftBlue transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          목록
        </button>

        {isOwner && (
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrivateToggle}
              disabled={isToggling || isDeleting}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                patchMessage
                  ? 'text-gray-600 border-gray-200 hover:bg-gray-50'
                  : 'text-ftBlue border-ftBlue/30 bg-ftBlue/5 hover:bg-ftBlue/10'
              }`}
            >
              {patchMessage ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                  나만보기
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  공개
                </>
              )}
            </button>
            <button
              onClick={() => router.push(`/article/modify/${pid}`)}
              disabled={isDeleting}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50 hover:text-ftBlue transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              수정
            </button>
            <button
              onClick={deleteCheck}
              disabled={isDeleting}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-500 rounded-lg border border-red-100 hover:bg-red-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              삭제
            </button>
          </div>
        )}
      </div>

      <Head>
        {/* next/head의 title은 child가 하나여야 SSR에 포함됨 (변수+문자열 혼용 금지) */}
        <title>{`${postTitle} | LOGME`}</title>
        <meta name="description" content={postDescription} />
        <meta
          name="keywords"
          content={postData?.tags?.map((tag: TagType) => tag.name).join(', ') || '기술블로그,개발자,프로그래밍'}
        />
        {isPublic ? (
          <>
            <meta name="robots" content="index, follow" />
            <meta name="googlebot" content="index, follow" />
          </>
        ) : (
          <>
            <meta name="robots" content="noindex, nofollow" />
            <meta name="googlebot" content="noindex, nofollow" />
          </>
        )}
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:title" content={postTitle} />
        <meta property="og:description" content={postDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={postImage} />
        <meta property="og:site_name" content="LOGME" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={postTitle} />
        <meta name="twitter:description" content={postDescription} />
        <meta name="twitter:image" content={postImage} />

        {isPublic && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'BlogPosting',
                headline: postTitle,
                description: postDescription,
                image: postImage,
                url: canonicalUrl,
                datePublished: postData?.created_at,
                dateModified: postData?.updated_at || postData?.created_at,
                author: {
                  '@type': 'Person',
                  name: postData?.user?.name || 'LOGME 사용자',
                },
                publisher: {
                  '@type': 'Organization',
                  name: 'LOGME',
                  logo: {
                    '@type': 'ImageObject',
                    url: 'https://logme.cloud/assets/logo.png',
                  },
                },
                mainEntityOfPage: {
                  '@type': 'WebPage',
                  '@id': canonicalUrl,
                },
                keywords: postData?.tags?.map((tag: TagType) => tag.name).join(', '),
                inLanguage: 'ko-KR',
              }),
            }}
          />
        )}
      </Head>

      <header className="w-full">
        {/* 제목 */}
        {shouldShowSkeleton ? (
          <div className="mb-4 w-3/4 h-8 bg-gray-200 rounded-lg tablet:h-12" />
        ) : (
          <div className="mb-4 text-2xl font-bold text-ftBlack mobile:text-3xl tablet:text-4xl leading-snug tracking-tight">
            {postData?.title}
          </div>
        )}

        {/* 태그 + 날짜 + 조회수 */}
        <div className="flex flex-col gap-2 mobile:flex-row mobile:items-center mobile:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {shouldShowSkeleton ? (
              <>
                <div className="w-20 h-6 bg-gray-200 rounded-full" />
                <div className="w-16 h-6 bg-gray-200 rounded-full" />
                <div className="w-24 h-6 bg-gray-200 rounded-full" />
              </>
            ) : (
              postData?.tags?.map((tag: TagType) => (
                <button
                  type="button"
                  key={tag.id}
                  onClick={() => handleTagSelect(tag)}
                  className={`px-3 py-0.5 text-xs font-medium rounded-full border transition-all duration-200 hover:scale-105 cursor-pointer ${
                    selectTagList.some(item => item.id === tag.id)
                      ? 'bg-ftBlue text-white border-ftBlue'
                      : 'bg-ftBlue/5 text-ftBlue border-ftBlue/20 hover:bg-ftBlue/10 hover:border-ftBlue/40'
                  }`}
                >
                  {tag.name}
                </button>
              ))
            )}
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {!shouldShowSkeleton && postData?.content && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {readingMinutes}분
              </span>
            )}
            {viewCount !== null && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {viewCount.toLocaleString()}
              </span>
            )}
            {!shouldShowSkeleton && postData && (
              <LikeButton
                postId={postData.id}
                initialLiked={postData.is_liked ?? false}
                initialCount={postData.like_count ?? 0}
                isPublic={postData.public_status}
                currentUserId={hasToken ? userInfo?.id : undefined}
                isInHeader={true}
              />
            )}
            <time className="text-xs text-gray-400">
              {postData?.created_at?.slice(0, 10)}
            </time>
          </div>
        </div>

        {/* 공유 버튼 */}
        {isPublic && !shouldShowSkeleton && (
          <div className="flex justify-end mt-3">
            <ShareButtons title={postTitle} url={canonicalUrl} />
          </div>
        )}

      </header>

      {!shouldShowSkeleton && postData?.series && (
        <SeriesNav seriesName={postData.series} currentPostId={postData.id} />
      )}

      <main className="w-full rounded-2xl border border-slate-100 bg-white shadow-sm px-6 py-8 tablet:px-10">
        <ContentLayout
          data={postData?.content}
          isLoading={shouldShowSkeleton}
          writer={postData?.user?.github_id}
          id={postData?.id}
        />
      </main>


      <PostNavigation
        prevPostInfo={resolvedData?.prevPostInfo}
        nextPostInfo={resolvedData?.nextPostInfo}
        basePath="/article/content"
        userInfo={postData?.user}
        isLoading={shouldShowSkeleton}
        ProfileComponent={Profile}
      />

      <CommentBox pid={pid} />

      {isPublic && postData?.id && (
        <RelatedPosts postId={postData.id} />
      )}
    </div>
  );
};

export default Detail;
