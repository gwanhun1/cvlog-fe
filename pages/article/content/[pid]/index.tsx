import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useQueryClient } from 'react-query';
import Link from 'next/link';
import CommentBox from 'components/Shared/LogmeComment';
import { useGetCommentList } from 'service/hooks/Comment';
import {
  DeleteDetail,
  useGetMyDetail,
  usePatchDetail,
} from 'service/hooks/Detail';
import Content from '../../../../components/pages/article/content/my/Content';
import Profile from '../../../../components/pages/article/content/my/Profile';
import { Badge } from 'flowbite-react';
import { useRecoilValue } from 'recoil';
import { userIdAtom } from 'service/atoms/atoms';
import { TagType } from 'service/api/detail/type';
import { NextPage } from 'next';

interface DetailProps {
  pid: string;
}

const Detail: NextPage<DetailProps> = ({ pid }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [patchMessage, setPatchMessage] = useState(false);

  const userInfo = useRecoilValue(userIdAtom);

  // 데이터 받기
  const getMyDetail = useGetMyDetail(parseInt(pid));
  const commentList = useGetCommentList(parseInt(pid));
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
        alert('이 게시물은 "나만보기"가 설정 되었습니다.');
      } else {
        alert('이 게시물은 전체에게 보입니다.');
      }
    } catch (error) {
      console.error('Error toggling private status:', error);
      alert('상태 변경 중 오류가 발생했습니다.');
    }
  };

  // 삭제 창
  const deleteContent = DeleteDetail(parseInt(pid));
  const deleteCheck = async () => {
    const check = confirm('삭제하시겠습니까?');
    if (check == true) {
      await deleteContent.mutate();
      await queryClient.invalidateQueries(['tagsFolder']);
      await queryClient.invalidateQueries('list');
      alert('삭제되었습니다.');
      router.push('/article');
    }
  };

  // 수정 창
  const updateCheck = () => {
    const check = confirm('수정하시겠습니까?');
    if (check == true) {
      router.push(`/article/modify/${pid}`);
    }
  };

  useEffect(() => {
    getMyDetail.refetch();
    commentList.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pid]);

  return (
    <div className="flex flex-col items-center  justify-center rounded-lg pb-7 tablet:my-15 w-full">
      <header className="w-full pt-7  border-gray-200 min-[400px]:border-hidden">
        {getMyDetail.isLoading ? (
          <div className="h-14 mb-3 bg-gray-200 rounded-lg w-28" />
        ) : (
          <h1 className="mr-1 text-xl text-ftBlack mobile:text-3xl tablet:text-6xl ">
            {getMyDetail?.data?.post.title}
          </h1>
        )}
      </header>
      <section className=" flex items-center justify-between w-full h-full border-b border-gray-400 ">
        <div className="flex flex-wrap justify-start w-full text-ftBlack mb-1 ">
          {getMyDetail.isLoading ? (
            <>
              <div className="h-6 mt-2 ml-2 bg-gray-200 rounded-lg w-16" />
              <div className="h-6 mt-2 ml-2 bg-gray-200 rounded-lg w-16" />
              <div className="h-6 mt-2 ml-2 bg-gray-200 rounded-lg w-16" />
            </>
          ) : (
            getMyDetail.data?.post.tags.map((tag: TagType) => (
              <Badge
                className=" mr-1 duration-300 hover:scale-105 hover:cursor-pointer relative flex items-center px-3 mt-1 rounded-full border-2 border-blue-300 bg-blue-200 text-blue-800 hover:bg-blue-200 hover:border-blue-400 transition-all"
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
          <time className="text-xs text-gray-600 tablet:text-sm mb-1">
            {getMyDetail && getMyDetail.data?.post.created_at.slice(0, 10)}
          </time>
        </section>
      </section>
      <main className="w-full h-min-screen tablet:pb-12">
        <section>
          <div className="flex justify-end w-full">
            <article className="flex flex-row mt-1 mr-1 tablet:mt-1 tablet:m-0  h-10">
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
      <section className="flex justify-between w-full max-w-[60rem] gap-2 px-2 tablet:px-4 pb-2 border-b border-gray-400 mobile:pb-5 mt-7">
        <article className="mb-4 mobile:mb-0 w-1/2">
          <Profile getDetailData={getMyDetail?.data?.post.user_id} />
        </article>
        <div className="flex items-center justify-between w-1/2">
          <div className="w-[48%] tablet:w-[49%]">
            {getMyDetail.data?.prevPostInfo ? (
              <Link
                href={`/article/content/${getMyDetail.data.prevPostInfo.id}`}
                prefetch
              >
                <div className="flex items-center justify-start w-full h-10 px-2 bg-gray-200 rounded-md cursor-pointer text-ftBlack hover:opacity-70 mobile:h-12 tablet:h-14 tablet:px-4">
                  <div className="pr-2 text-lg tablet:text-xl">←</div>
                  <div className="flex-col flex w-full truncate">
                    <div className="text-xs tablet:text-sm text-gray-500">
                      이전 포스트
                    </div>
                    <div className="h-5 overflow-hidden text-sm font-bold tablet:text-base flex-nowrap mt-[2px] truncate">
                      {getMyDetail.data.prevPostInfo.title}
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="flex items-center justify-start w-full h-10 px-2 bg-gray-200 rounded-md cursor-not-allowed text-ftBlack opacity-50 mobile:h-12 tablet:h-14 tablet:px-4" />
            )}
          </div>

          <div className="w-[48%] tablet:w-[49%]">
            {getMyDetail.data?.nextPostInfo ? (
              <Link
                href={`/article/content/${getMyDetail.data.nextPostInfo.id}`}
                prefetch
              >
                <div className="flex items-center justify-end w-full h-10 px-2 bg-gray-200 rounded-md cursor-pointer text-ftBlack hover:opacity-70 mobile:h-12 tablet:h-14 tablet:px-4">
                  <div className="flex-col flex w-full truncate text-right">
                    <div className="text-xs tablet:text-sm text-gray-500">
                      다음 포스트
                    </div>
                    <div className="h-5 overflow-hidden text-sm font-bold tablet:text-base flex-nowrap mt-[2px] truncate">
                      {getMyDetail.data.nextPostInfo.title}
                    </div>
                  </div>
                  <div className="pl-2 text-lg tablet:text-xl">→</div>
                </div>
              </Link>
            ) : (
              <div className="flex items-center justify-end w-full h-10 px-2 bg-gray-200 rounded-md cursor-not-allowed text-ftBlack opacity-50 mobile:h-12 tablet:h-14 tablet:px-4" />
            )}
          </div>
        </div>
      </section>
      <CommentBox pid={pid} />
    </div>
  );
};

export default Detail;

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps = async ({ params }: any) => {
  const pid = params?.pid;

  if (!pid) {
    return {
      notFound: true,
    };
  }

  try {
    return {
      props: {
        pid,
      },
      revalidate: 60,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
