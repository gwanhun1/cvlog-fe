import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
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
import Content from '../../../../../components/pages/article/content/all/Content';
import Profile from '../../../../../components/pages/article/content/all/Profile';
import { Badge } from 'flowbite-react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  selectedTagListAtom,
  tagListAtom,
  userIdAtom,
} from 'service/atoms/atoms';
import { TagType } from 'service/api/detail/type';
import { NextPage } from 'next';

interface DetailProps {
  pid: string;
  initialData?: any; // getStaticProps에서 가져온 초기 데이터 (선택사항)
}

const Detail: NextPage<DetailProps> = ({ pid, initialData }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [patchMessage, setPatchMessage] = useState(false);
  const userInfo = useRecoilValue(userIdAtom);
  const { showToast, showConfirm } = useToast();
  const [_, setTagList] = useRecoilState(tagListAtom);
  // 데이터 받기 - initialData를 사용하여 초기 상태 설정
  const {
    data: detailData,
    isLoading,
    refetch: detailRefetch,
  } = useGetDetail(parseInt(pid), data => {
    if (data?.post) {
      setPatchMessage(data.post.public_status);
      setTagList(data.post.tags);
    }
  });

  const { data: commentData, refetch: commentRefetch } = useGetCommentList(
    parseInt(pid)
  );
  const patchDetailMutation = usePatchDetail();

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
    detailRefetch();
    commentRefetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pid]);

  const [selectTagList, setSelectTagList] = useRecoilState(selectedTagListAtom);

  // 태그 선택 처리 함수
  const handleTagSelect = (tag: TagType) => {
    if (selectTagList.includes(tag)) {
      setSelectTagList(selectTagList.filter(item => item !== tag));
    } else {
      setSelectTagList([...selectTagList, tag]);
    }
  };

  // SSR용 데이터: initialData 우선, 없으면 CSR detailData 사용
  const postData = initialData?.post || detailData?.post;

  // SEO 메타데이터 (SSR에서도 initialData로 렌더링됨)
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
        {isLoading ? (
          <div className="mb-3 w-28 h-14 bg-gray-200 rounded-lg" />
        ) : (
          <h1 className="mr-1 text-xl text-ftBlack mobile:text-3xl tablet:text-6xl">
            {detailData?.post.title}
          </h1>
        )}
      </header>
      <section className="flex justify-between items-center w-full h-full border-b border-gray-400">
        <div className="flex flex-wrap justify-start mb-1 w-full text-ftBlack">
          {isLoading ? (
            <>
              <div className="mt-2 ml-2 w-16 h-6 bg-gray-200 rounded-lg" />
              <div className="mt-2 ml-2 w-16 h-6 bg-gray-200 rounded-lg" />
              <div className="mt-2 ml-2 w-16 h-6 bg-gray-200 rounded-lg" />
            </>
          ) : (
            detailData?.post.tags.map((tag: TagType) => (
              <Badge
                className={`mr-1 duration-300 hover:scale-105 hover:cursor-pointer relative flex items-center px-3 py-1 rounded-full border-2 ${
                  selectTagList.includes(tag)
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
            {detailData && detailData.post.created_at.slice(0, 10)}
          </time>
        </section>
      </section>
      <main className="w-full h-full tablet:pb-12">
        <section>
          <div className="flex justify-end w-full">
            <article className="flex flex-row mt-1 mr-1 tablet:mt-1 tablet:m-0">
              {Number(userInfo?.id) === detailData?.post.user_id.id ||
              userInfo?.github_id ===
                String(detailData?.post?.user_id?.github_id) ? (
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
              data={detailData?.post.content}
              isLoading={isLoading}
              writer={detailData?.post.user_id.github_id}
              id={detailData?.post.id}
            />
          </div>
        </section>
      </main>
      {/* 프로필 영역 */}
      <section className="pb-6 mt-10 w-full border-b border-gray-200">
        <Profile getDetailData={detailData?.post.user_id} />
      </section>

      {/* 이전/다음 포스트 네비게이션 */}
      <nav className="mt-8 mb-4 w-full">
        <div className="grid grid-cols-2 gap-3 tablet:gap-4">
          <div>
            {detailData?.prevPostInfo ? (
              <Link
                href={`/article/content/all/${detailData.prevPostInfo.id}`}
                prefetch
              >
                <div className="flex gap-3 items-center p-4 h-full bg-gray-50 rounded-xl border border-gray-200 transition-all duration-200 cursor-pointer group hover:bg-gray-100 hover:border-gray-300">
                  <div className="flex justify-center items-center w-8 h-8 bg-gray-200 rounded-full transition-colors group-hover:bg-gray-300">
                    <span className="text-gray-600">←</span>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="mb-1 text-xs text-gray-500">
                      이전 포스트
                    </span>
                    <span className="text-sm font-semibold text-gray-800 truncate">
                      {detailData.prevPostInfo.title}
                    </span>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="flex gap-3 items-center p-4 h-full bg-gray-50 rounded-xl border border-gray-100 opacity-40 cursor-not-allowed">
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                <span className="text-sm text-gray-400">이전 포스트 없음</span>
              </div>
            )}
          </div>

          <div>
            {detailData?.nextPostInfo ? (
              <Link
                href={`/article/content/all/${detailData.nextPostInfo.id}`}
                prefetch
              >
                <div className="flex gap-3 justify-end items-center p-4 h-full bg-gray-50 rounded-xl border border-gray-200 transition-all duration-200 cursor-pointer group hover:bg-gray-100 hover:border-gray-300">
                  <div className="flex flex-col flex-1 min-w-0 text-right">
                    <span className="mb-1 text-xs text-gray-500">
                      다음 포스트
                    </span>
                    <span className="text-sm font-semibold text-gray-800 truncate">
                      {detailData.nextPostInfo.title}
                    </span>
                  </div>
                  <div className="flex justify-center items-center w-8 h-8 bg-gray-200 rounded-full transition-colors group-hover:bg-gray-300">
                    <span className="text-gray-600">→</span>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="flex gap-3 justify-end items-center p-4 h-full bg-gray-50 rounded-xl border border-gray-100 opacity-40 cursor-not-allowed">
                <span className="text-sm text-gray-400">다음 포스트 없음</span>
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
              </div>
            )}
          </div>
        </div>
      </nav>
      <CommentBox pid={pid} />
    </div>
  );
};

export default Detail;

// 게시물 타입 정의
interface PostType {
  id: number;
  public_status: boolean;
  title?: string;
  created_at?: string;
  updated_at?: string;
  content?: string;
  summary?: string;
  image_url?: string;
  thumbnail_image_url?: string;
  is_featured?: boolean;
  tags?: any[];
}

export const getStaticPaths = async () => {
  try {
    // 백엔드 API URL 설정
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.logme.shop';

    // 공개 상태(public_status가 true)인 게시물 데이터 가져오기
    const response = await fetch(`${API_URL}/post/posts/public`);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const posts = (await response.json()) as PostType[];

    // 유효한 ID를 가진 공개 게시물에 대한 경로 생성
    const paths = posts
      .filter((post: PostType) => post.public_status && post.id) // 공개 상태이고 유효한 ID가 있는 게시물만 필터링
      .map((post: PostType) => ({
        params: { pid: post.id.toString() },
      }));

    console.log(`Pre-generating ${paths.length} public article pages`);

    return {
      paths,
      fallback: true, // Changed from 'blocking' to true for better error handling
    };
  } catch (error) {
    console.error('Error fetching public posts for static paths:', error);
    // 오류 발생 시 빈 paths 배열 반환하고 fallback으로 처리
    return {
      paths: [],
      fallback: true, // Changed from 'blocking' to true
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
    // 백엔드 API URL 설정
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL ||
      'https://port-0-cvlog-be-m708xf650a274e01.sel4.cloudtype.app';

    // 게시물 데이터 미리 가져오기
    const response = await fetch(`${API_URL}/posts/${pid}`);

    if (!response.ok) {
      console.error(`Failed to fetch post data: ${response.status}`);
      return {
        props: {
          pid,
          initialData: null,
        },
        revalidate: 10, // Reduced revalidation time for error cases
      };
    }

    const responseData = await response.json();
    // API 응답: { success: true, data: { post: {...} } }
    const postData = responseData?.data || responseData;

    // 게시물이 공개 상태가 아니면 404 페이지 반환
    if (postData?.post && !postData.post.public_status) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        pid,
        initialData: postData || null,
      },
      // ISR(Incremental Static Regeneration) - 30초마다 페이지 재생성 가능
      revalidate: 30,
    };
  } catch (error) {
    console.error(`Error getting static props for post ${pid}:`, error);
    // Instead of returning notFound, return valid props with null initialData
    return {
      props: {
        pid,
        initialData: null,
      },
      revalidate: 10,
    };
  }
};
