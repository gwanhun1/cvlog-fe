import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useToast } from 'components/Shared';
import { useQueryClient } from 'react-query';
import Link from 'next/link';
import Head from 'next/head';
import CommentBox from 'components/Shared/LogmeComment';
import { useGetCommentList } from 'service/hooks/Comment';
import {
  DeleteDetail,
  useGetMyDetail,
  usePatchDetail,
} from 'service/hooks/Detail';
import {
  Content,
  Profile,
  PostNavigation,
} from '../../../../components/pages/article/content';
import { Badge } from 'flowbite-react';
import { useRecoilValue } from 'recoil';
import { userIdAtom } from 'service/atoms/atoms';
import { TagType } from 'service/api/detail/type';
import { NextPage } from 'next';

interface DetailProps {
  pid: string;
  initialData?: any; // getStaticProps에서 가져온 초기 데이터
}

const Detail: NextPage<DetailProps> = ({ pid, initialData }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [patchMessage, setPatchMessage] = useState(false);
  const { showToast, showConfirm } = useToast();

  const userInfo = useRecoilValue(userIdAtom);

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

  // 삭제 창
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

  // 수정 창
  const updateCheck = () => {
    router.push(`/article/modify/${pid}`);
  };

  useEffect(() => {
    getMyDetail.refetch();
    commentList.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pid]);

  return (
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
  );
};

export default Detail;

export const getStaticPaths = async () => {
  try {
    // API에서 모든 공개 게시물 가져오기 시도
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.logme.shop';
    const response = await fetch(`${API_URL}/post/posts/public`);
    const posts = await response.json();

    // 공개 게시물의 경로 생성
    const paths = posts.map((post: any) => ({
      params: { pid: post.id.toString() },
    }));

    return {
      paths,
      fallback: 'blocking', // 경로가 없으면 서버에서 생성 시도
    };
  } catch (error) {
    console.error('Error fetching paths:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
};

export const getStaticProps = async ({ params }: any) => {
  const pid = params?.pid;

  if (!pid) {
    return {
      notFound: true,
    };
  }

  try {
    // 게시물 데이터 미리 가져오기 시도
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.logme.shop';
    const response = await fetch(`${API_URL}/post/post/${pid}`);
    const postData = await response.json();

    // 미리 가져온 데이터를 함께 전달 (페이지 초기 로딩 시 사용)
    return {
      props: {
        pid,
        initialData: postData,
      },
      // 1시간마다 재생성 (백엔드가 오프라인일 때도 캐시된 버전 제공)
      revalidate: 3600,
    };
  } catch (error) {
    console.error(`Error fetching post ${pid}:`, error);
    return {
      props: {
        pid,
        initialData: null,
      },
      revalidate: 3600,
    };
  }
};
