import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useToast } from 'components/Shared';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import Head from 'next/head';
import CommentBox from 'components/Shared/LogmeComment';
import { useGetCommentList } from 'service/hooks/Comment';
import {
  useDeleteDetail,
  useGetMyDetail,
  usePatchDetail,
} from 'service/hooks/Detail';
import {
  Content,
  Profile,
  PostNavigation,
} from '../../../../components/pages/article/content';
import { Badge } from 'flowbite-react';
import { useStore } from 'service/store/useStore';
import { TagType } from 'service/api/detail/type';
import { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import AuthGuard from 'components/Shared/common/AuthGuard';

interface DetailProps {
  pid: string;
  initialData?: any; // getStaticProps에서 가져온 초기 데이터
}

const Detail: NextPage<DetailProps> = ({ pid, initialData }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [patchMessage, setPatchMessage] = useState(false);
  const { showToast, showConfirm } = useToast();

  const userInfo = useStore((state) => state.userIdAtom);

  // 데이터 받기
  const getMyDetail = useGetMyDetail(parseInt(pid));
  const commentList = useGetCommentList(parseInt(pid));

  // 초기 데이터가 있으면 QueryClient의 캐시에 저장
  useEffect(() => {
    if (initialData && queryClient) {
      queryClient.setQueryData(['detail', pid], initialData);
    }
  }, [initialData, pid, queryClient]);
  const patchDetailMutation = usePatchDetail();

  useEffect(() => {
    if (getMyDetail.data?.post) {
      setPatchMessage(getMyDetail.data.post.public_status);
    }
  }, [getMyDetail.data]);

  // 나만보기 메세지 창
  const handlePrivateToggle = async () => {
    const newPublicStatus = !patchMessage;
    try {
      await patchDetailMutation.mutateAsync({
        id: parseInt(pid),
        public_status: newPublicStatus,
      });
      setPatchMessage(newPublicStatus);

      // 캐시 업데이트
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['detail', pid] }),
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === 'publicList',
        }),
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === 'list',
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

  // 삭제 창
  const deleteContent = useDeleteDetail(parseInt(pid));
  const deleteCheck = () => {
    showConfirm('삭제하시겠습니까?', async () => {
      await deleteContent.mutate();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['tagsFolder'] }),
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === 'list',
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          // @ts-ignore
        }),
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === 'publicList',
        }),
      ]);
      showToast('삭제되었습니다.', 'success');
      router.push('/article');
    });
  };

  // 수정 창
  const updateCheck = () => {
    router.push(`/article/modify/${pid}`);
  };

  useEffect(() => {
    // getStaticProps를 통해 이미 데이터를 받았으므로 마운트 시점의 강제 리페칭 제거
  }, [pid]);

  return (
    <AuthGuard>
      <div className="flex flex-col justify-center items-center pb-7 w-full rounded-lg tablet:my-15">
        {getMyDetail.data?.post && (
          <Head>
            <title>{getMyDetail.data.post.title} | LogMe</title>
            <meta
              name="description"
              content={getMyDetail.data.post.content.substring(0, 160)}
            />
            <meta
              name="keywords"
              content={getMyDetail.data.post.tags
                .map((tag: TagType) => tag.name)
                .join(', ')}
            />

            {/* Canonical URL - 중요 */}
            <link
              rel="canonical"
              href={`https://logme.shop/article/content/${pid}`}
            />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="article" />
            <meta property="og:title" content={getMyDetail.data.post.title} />
            <meta
              property="og:description"
              content={getMyDetail.data.post.content.substring(0, 160)}
            />
            <meta
              property="og:url"
              content={`https://logme.shop/article/content/${pid}`}
            />
            <meta property="og:site_name" content="LogMe" />

            {/* 구글 검색 추가 옵션 */}
            <meta name="robots" content="index, follow" />
            <meta name="googlebot" content="index, follow" />

            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'BlogPosting',
                  headline: getMyDetail.data.post.title,
                  description: getMyDetail.data.post.content.substring(0, 160),
                  keywords: getMyDetail.data.post.tags
                    .map((tag: TagType) => tag.name)
                    .join(', '),
                  author: {
                    '@type': 'Person',
                    name: 'LogMe 사용자',
                  },
                  datePublished: getMyDetail.data.post.created_at,
                  dateModified: getMyDetail.data.post.updated_at,
                  mainEntityOfPage: {
                    '@type': 'WebPage',
                    '@id': `https://logme.shop/article/content/${pid}`,
                  },
                  publisher: {
                    '@type': 'Organization',
                    name: 'LogMe',
                    logo: {
                      '@type': 'ImageObject',
                      url: 'https://logme.shop/favicon.svg',
                    },
                  },
                }),
              }}
            />
          </Head>
        )}
        <header className="w-full pt-7  border-gray-200 min-[400px]:border-hidden">
          {getMyDetail.isLoading ? (
            <div className="mb-3 w-3/4 h-10 bg-gray-200 rounded-lg tablet:h-14" />
          ) : (
            <h1 className="mr-1 text-xl text-ftBlack mobile:text-3xl tablet:text-6xl">
              {getMyDetail?.data?.post.title}
            </h1>
          )}
        </header>
        <section className="flex justify-between items-center w-full h-full border-b border-gray-400">
          <div className="flex flex-wrap justify-start mb-1 w-full text-ftBlack">
            {getMyDetail.isLoading ? (
              <>
                <div className="mt-1 mr-1 w-20 h-7 bg-gray-200 rounded-full" />
                <div className="mt-1 mr-1 w-16 h-7 bg-gray-200 rounded-full" />
                <div className="mt-1 mr-1 w-24 h-7 bg-gray-200 rounded-full" />
              </>
            ) : (
              getMyDetail.data?.post.tags.map((tag: TagType) => (
                <Badge
                  className="flex relative items-center px-3 mt-1 mr-1 text-blue-800 bg-blue-200 rounded-full border-2 border-blue-300 transition-all duration-300 hover:scale-105 hover:cursor-pointer hover:bg-blue-200 hover:border-blue-400"
                  color="default"
                  size="sm"
                  key={tag.id}
                >
                  <Link
                    href={{
                      pathname: '/article',
                      query: { tagKeyword: tag.name },
                    }}
                  >
                    <span className="cursor-pointer">{tag.name}</span>
                  </Link>
                </Badge>
              ))
            )}
          </div>
          <section className="flex items-end w-28">
            <time className="mb-1 text-xs text-gray-600 tablet:text-sm">
              {getMyDetail && getMyDetail.data?.post.created_at.slice(0, 10)}
            </time>
          </section>
        </section>
        <main className="w-full h-min-screen tablet:pb-12">
          <section>
            <div className="flex justify-end w-full">
              <article className="flex flex-row mt-1 mr-1 h-10 tablet:mt-1 tablet:m-0">
                {Number(userInfo?.id) === getMyDetail?.data?.post.user_id.id ||
                userInfo?.github_id ===
                  String(getMyDetail?.data?.post.user_id.id) ? (
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
              <Content
                id={getMyDetail.data?.post.id}
                data={getMyDetail.data?.post.content}
                isLoading={getMyDetail.isLoading}
              />
            </div>
          </section>
        </main>
        <PostNavigation
          prevPostInfo={getMyDetail.data?.prevPostInfo}
          nextPostInfo={getMyDetail.data?.nextPostInfo}
          basePath="/article/content"
          userInfo={getMyDetail?.data?.post?.user_id}
          ProfileComponent={Profile}
        />
        <CommentBox pid={pid} />
      </div>
    </AuthGuard>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }: any) => {
  const pid = params?.pid;

  if (!pid) {
    return { notFound: true };
  }

  try {
    const API_URL =
      process.env.NODE_ENV === 'production'
        ? 'https://port-0-cvlog-be-m708xf650a274e01.sel4.cloudtype.app'
        : process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

    const response = await fetch(`${API_URL}/posts/${pid}`);
    const responseData = await response.json();

    if (!responseData?.data) {
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
    console.error(`Error fetching post ${pid}:`, error);
    return { notFound: true };
  }
};

export default Detail;
