import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps, NextPage } from 'next';
import axios from 'axios';
import { useToast } from 'components/Shared';
import { useQueryClient } from 'react-query';
import Link from 'next/link';
import Head from 'next/head';
import removeMarkdown from 'markdown-to-text';
import CommentBox from 'components/Shared/LogmeComment';
import { useGetCommentList } from 'service/hooks/Comment';
import {
  DeleteDetail,
  useGetDetail,
  usePatchDetail,
} from 'service/hooks/Detail';
import {
  Content as ContentLayout,
  Profile,
  PostNavigation,
} from '../../../../../components/pages/article/content';
import { Badge } from 'flowbite-react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  selectedTagListAtom,
  tagListAtom,
  userIdAtom,
} from 'service/atoms/atoms';
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

export const getServerSideProps: GetServerSideProps = async context => {
  const pid = context.params?.pid;

  if (!pid || Array.isArray(pid)) {
    return { notFound: true };
  }

  const API_URL =
    process.env.NODE_ENV === 'production'
      ? 'https://port-0-cvlog-be-m708xf650a274e01.sel4.cloudtype.app'
      : process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

  try {
    const { data } = await axios.get<ContentResponse>(
      `${API_URL}/posts/${pid}`,
      {
        headers: { 'Cache-Control': 'no-cache' },
      }
    );

    if (!data?.data?.post?.public_status) {
      return { notFound: true };
    }

    return {
      props: {
        pid,
        initialData: data.data,
      },
    };
  } catch (error) {
    console.error('[SSR] post detail fetch error', error);
    return { notFound: true };
  }
};

const Detail: NextPage<DetailProps> = ({ pid: propsPid, initialData }) => {
  const router = useRouter();
  const pid = propsPid || (router.query.pid as string);
  const queryClient = useQueryClient();
  const [patchMessage, setPatchMessage] = useState(false);
  const userInfo = useRecoilValue(userIdAtom);
  const { showToast, showConfirm } = useToast();
  const [_, setTagList] = useRecoilState(tagListAtom);
  const {
    data: detailData,
    isLoading,
    refetch: detailRefetch,
  } = useGetDetail(
    parseInt(pid),
    data => {
      if (data?.post) {
        setPatchMessage(data.post.public_status);
        setTagList(data.post.tags);
      }
    },
    initialData
  );

  const { data: commentData, refetch: commentRefetch } = useGetCommentList(
    parseInt(pid)
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

      await queryClient.invalidateQueries(['detail', pid]);
      await queryClient.invalidateQueries('publicPosts');

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

  const deleteContent = DeleteDetail(parseInt(pid));
  const deleteCheck = () => {
    showConfirm('삭제하시겠습니까?', async () => {
      await deleteContent.mutate();
      await queryClient.invalidateQueries(['tagsFolder']);
      await queryClient.invalidateQueries('list');
      showToast('삭제되었습니다.', 'success');
      router.push('/article');
    });
  };

  const updateCheck = () => {
    router.push(`/article/modify/${pid}`);
  };

  useEffect(() => {
    detailRefetch();
    commentRefetch();
  }, [pid, detailRefetch, commentRefetch]);

  const [selectTagList, setSelectTagList] = useRecoilState(selectedTagListAtom);

  const handleTagSelect = (tag: TagType) => {
    setSelectTagList(prev => {
      const exists = prev.some(item => item.id === tag.id);
      return exists ? prev.filter(item => item.id !== tag.id) : [...prev, tag];
    });
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

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={postTitle} />
        <meta name="twitter:description" content={postDescription} />
        <meta name="twitter:image" content={postImage} />

        <link rel="canonical" href={canonicalUrl} />

        <script type="application/ld+json">
          {JSON.stringify({
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
          })}
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
