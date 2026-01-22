import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { GetStaticProps, GetStaticPaths, NextPage } from 'next';
import axios from 'axios';
import { useToast } from 'components/Shared';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import Head from 'next/head';
import removeMarkdown from 'markdown-to-text';
import CommentBox from 'components/Shared/LogmeComment';
import { useGetCommentList } from 'service/hooks/Comment';
import {
  useDeleteDetail,
  useGetDetail,
  usePatchDetail,
} from 'service/hooks/Detail';
import {
  Content as ContentLayout,
  Profile,
  PostNavigation,
} from '../../../../../components/pages/article/content';
import { Badge } from 'flowbite-react';
import { useStore } from 'service/store/useStore';
import type {
  ContentData,
  TagType,
  Content as ContentResponse,
} from 'service/api/detail/type';

interface DetailProps {
  pid: string;
  initialData?: {
    post: ContentData;
    prevPostInfo: { id: number; title: string } | null;
    nextPostInfo: { id: number; title: string } | null;
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [], // 빌드 시간을 줄이기 위해 빈 배열로 설정
    fallback: 'blocking', // 새로운 페이지는 요청 시점에 실시간 생성 (ISR)
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const pidParam = context.params?.pid;
  const pid = Array.isArray(pidParam) ? pidParam[0] : pidParam;

  if (!pid) {
    return { notFound: true };
  }

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'https://port-0-cvlog-be-m708xf650a274e01.sel4.cloudtype.app';

  try {
    const response = await fetch(`${API_URL}/posts/${pid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`[ISR] fetch failed with status: ${response.status}`);
      return { notFound: true };
    }

    const responseData = await response.json();

    if (!responseData?.data?.post) {
      return { notFound: true };
    }

    // 비공개 게시물인 경우 public 세부페이지에서는 404 처리
    if (!responseData.data.post.public_status) {
      return { notFound: true };
    }

    return {
      props: {
        pid,
        initialData: responseData.data,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('[ISR] post detail fetch error', error);
    return { notFound: true };
  }
};

const Detail: NextPage<DetailProps> = ({ pid: propsPid, initialData }) => {
  const router = useRouter();
  const pid = propsPid || (router.query.pid as string);
  const queryClient = useQueryClient();
  const [patchMessage, setPatchMessage] = useState(false);
  const userInfo = useStore(state => state.userIdAtom);
  const { showToast, showConfirm } = useToast();
  const setTagList = useStore(state => state.setTagListAtom);
  const selectTagList = useStore(state => state.selectedTagListAtom);
  const setSelectTagList = useStore(state => state.setSelectedTagListAtom);

  const {
    data: detailData,
    isLoading,
    refetch: detailRefetch,
  } = useGetDetail(parseInt(pid), initialData);

  useEffect(() => {
    if (detailData?.post) {
      setPatchMessage(detailData.post.public_status);
      setTagList(detailData.post.tags);
    }
  }, [detailData, setTagList]);

  const { data: commentData, refetch: commentRefetch } = useGetCommentList(
    parseInt(pid),
  );
  const patchDetailMutation = usePatchDetail();

  const handlePrivateToggle = async () => {
    const newPublicStatus = !patchMessage;
    try {
      await patchDetailMutation.mutateAsync({
        id: parseInt(pid),
        public_status: newPublicStatus,
      });
      setPatchMessage(newPublicStatus);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['detail', pid] }),
        queryClient.invalidateQueries({
          predicate: query => query.queryKey[0] === 'publicList',
        }),
        queryClient.invalidateQueries({
          predicate: query => query.queryKey[0] === 'list',
        }),
      ]);

      if (!newPublicStatus) {
        showToast('이 게시물은 "나만보기"가 설정 되었습니다.', 'success');
      } else {
        showToast('이 게시물은 전체에게 보입니다.', 'success');
      }
    } catch (error) {
      console.error('Error toggling private status:', error);
      showToast('상태 변경 중 오류가 발생했습니다.', 'error');
    }
  };

  const deleteContent = useDeleteDetail(parseInt(pid));
  const deleteCheck = () => {
    showConfirm('삭제하시겠습니까?', async () => {
      await deleteContent.mutate();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['tagsFolder'] }),
        queryClient.invalidateQueries({
          predicate: query => query.queryKey[0] === 'list',
        }),
        queryClient.invalidateQueries({
          predicate: query => query.queryKey[0] === 'publicList',
        }),
      ]);
      showToast('삭제되었습니다.', 'success');
      router.push('/article');
    });
  };

  const updateCheck = () => {
    router.push(`/article/modify/${pid}`);
  };

  useEffect(() => {
    // getStaticProps를 통해 이미 데이터를 받았으므로, 마운트 시점의 강제 리페칭을 제거하여 속도 개선
    // 컴포넌트가 마운트될 때 react-query의 staleTime/cacheTime 전략에 따라 필요 시 자동으로 최신화됩니다.
  }, [pid]);

  const handleTagSelect = (tag: TagType) => {
    const exists = selectTagList.some(item => item.id === tag.id);
    const newList = exists
      ? selectTagList.filter(item => item.id !== tag.id)
      : [...selectTagList, tag];
    setSelectTagList(newList);
  };

  const resolvedDetailData = initialData || detailData;
  const shouldShowSkeleton = isLoading && !initialData;
  const postData = resolvedDetailData?.post;

  const postTitle = postData?.title || 'LogMe 게시물';
  const postDescription = useMemo(() => {
    const content = postData?.content;
    if (!content) return 'LogMe 블로그의 게시물입니다.';
    const plainText = removeMarkdown(content)
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return plainText.length > 155
      ? plainText.substring(0, 155) + '...'
      : plainText;
  }, [postData?.content]);

  // 에러 처리 또는 데이터 없음 처리 (비공개 게시물 등)
  if (!shouldShowSkeleton && !resolvedDetailData?.post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="mb-4 text-2xl font-bold text-gray-700">
          게시물을 찾을 수 없습니다.
        </h2>
        <p className="mb-8 text-gray-500">
          삭제되었거나 비공개된 게시물일 수 있습니다.
        </p>
        <Link href="/article">
          <a className="px-6 py-2 text-white bg-blue-500 rounded-lg transition-colors hover:bg-blue-600">
            목록으로 돌아가기
          </a>
        </Link>
      </div>
    );
  }
  const postImage = 'https://logme.shop/assets/NavLogo.svg';
  const canonicalUrl = `https://logme.shop/article/content/all/${pid}`;

  return (
    <div className="flex flex-col justify-center items-center pb-7 w-full rounded-lg tablet:my-15">
      <Head>
        <title>{postTitle} | LogMe</title>
        <meta name="description" content={postDescription} />
        <meta
          name="keywords"
          content={
            postData?.tags?.map((tag: TagType) => tag.name).join(', ') ||
            '기술블로그,개발자,프로그래밍'
          }
        />

        <meta property="og:title" content={postTitle} />
        <meta property="og:description" content={postDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={postImage} />
        <meta property="og:site_name" content="LogMe" />

        {/* 구글 검색 색인 허용 설정 */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={postTitle} />
        <meta name="twitter:description" content={postDescription} />
        <meta name="twitter:image" content={postImage} />

        <link rel="canonical" href={canonicalUrl} />

        <script type="application/ld+json">
          {JSON.stringify([
            {
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
                name: postData?.user_id?.name || 'LogMe 사용자',
              },
              publisher: {
                '@type': 'Organization',
                name: 'LogMe',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://logme.shop/assets/NavLogo.svg',
                },
              },
              mainEntityOfPage: canonicalUrl,
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: '홈',
                  item: 'https://logme.shop',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: '게시물',
                  item: 'https://logme.shop/article',
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: postTitle,
                  item: canonicalUrl,
                },
              ],
            },
          ])}
        </script>
      </Head>
      <header className="w-full pt-7  border-gray-200 min-[400px]:border-hidden">
        {shouldShowSkeleton ? (
          <div className="mb-3 w-3/4 h-10 bg-gray-200 rounded-lg tablet:h-14" />
        ) : (
          <h1 className="mr-1 text-xl text-ftBlack mobile:text-3xl tablet:text-6xl">
            {resolvedDetailData?.post?.title}
          </h1>
        )}
      </header>
      <section className="flex justify-between items-center w-full h-full border-b border-gray-400">
        <div className="flex flex-wrap justify-start mb-1 w-full text-ftBlack">
          {shouldShowSkeleton ? (
            <>
              <div className="mt-1 mr-1 w-20 h-7 bg-gray-200 rounded-full" />
              <div className="mt-1 mr-1 w-16 h-7 bg-gray-200 rounded-full" />
              <div className="mt-1 mr-1 w-24 h-7 bg-gray-200 rounded-full" />
            </>
          ) : (
            resolvedDetailData?.post?.tags?.map((tag: TagType) => (
              <Badge
                className={`mr-1 duration-300 hover:scale-105 hover:cursor-pointer relative flex items-center px-3 py-1 rounded-full border-2 ${
                  selectTagList.some(item => item.id === tag.id)
                    ? 'bg-blue-500 text-white border-blue-600'
                    : 'bg-blue-100 text-blue-800 border-blue-300'
                } hover:bg-blue-200 hover:border-blue-400 transition-all`}
                color="default"
                size="sm"
                key={tag.id}
                onClick={() => handleTagSelect(tag)}
              >
                <span className="cursor-pointer">{tag.name}</span>
              </Badge>
            ))
          )}
        </div>
        <section className="flex items-end w-28">
          <time className="mb-1 text-xs text-gray-600 tablet:text-sm">
            {resolvedDetailData?.post?.created_at?.slice(0, 10)}
          </time>
        </section>
      </section>
      <main className="w-full h-full tablet:pb-12">
        <section>
          <div className="flex justify-end w-full">
            <article className="flex flex-row mt-1 mr-1 tablet:mt-1 tablet:m-0">
              {Number(userInfo?.id) === resolvedDetailData?.post?.user_id?.id ||
              userInfo?.github_id ===
                String(resolvedDetailData?.post?.user_id?.github_id) ? (
                <>
                  <button
                    className="m-1 text-[10px] cursor-pointer tablet:p-1 tablet:text-sm text-gray-600  hover:font-bold"
                    onClick={() => {
                      handlePrivateToggle();
                    }}
                  >
                    {patchMessage ? '나만보기' : '공개'}
                  </button>

                  <button
                    className="m-1 text-[10px] cursor-pointer tablet:p-1 tablet:text-sm hover:text-blue-400 text-ftBlack "
                    onClick={() => {
                      updateCheck();
                    }}
                  >
                    수정
                  </button>
                  <button
                    className="m-1 text-[10px] cursor-pointer tablet:p-1 tablet:text-sm hover:text-red-400 text-ftBlack"
                    onClick={() => {
                      deleteCheck();
                    }}
                  >
                    삭제
                  </button>
                </>
              ) : null}
            </article>
          </div>

          <div className="flex justify-center">
            <ContentLayout
              data={resolvedDetailData?.post?.content}
              isLoading={shouldShowSkeleton}
              writer={resolvedDetailData?.post?.user_id?.github_id}
              id={resolvedDetailData?.post?.id}
            />
          </div>
        </section>
      </main>
      <PostNavigation
        prevPostInfo={resolvedDetailData?.prevPostInfo}
        nextPostInfo={resolvedDetailData?.nextPostInfo}
        basePath="/article/content/all"
        userInfo={resolvedDetailData?.post?.user_id}
        ProfileComponent={Profile}
      />
      <CommentBox pid={pid} />
    </div>
  );
};

export default Detail;
