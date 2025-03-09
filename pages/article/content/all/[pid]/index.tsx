import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useQueryClient } from 'react-query';
import Link from 'next/link';
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
import { useRecoilValue } from 'recoil';
import { userIdAtom } from 'service/atoms/atoms';
import { TagType } from 'service/api/detail/type';

const Detail = ({ pid }: { pid: string }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [patchMessage, setPatchMessage] = useState(false);
  const userInfo = useRecoilValue(userIdAtom);
  // 데이터 받기
  const getDetailData = useGetDetail(parseInt(pid));
  const commentList = useGetCommentList(parseInt(pid));
  const patchDetailMutation = usePatchDetail();

  useEffect(() => {
    if (getDetailData.data?.post) {
      setPatchMessage(getDetailData.data.post.public_status);
    }
  }, [getDetailData.data]);

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
      await queryClient.invalidateQueries('tagsFolder');
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
    getDetailData.refetch();
    commentList.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pid]);

  return (
    <div className="flex flex-col items-center  justify-center rounded-lg pb-7 tablet:my-15 w-full">
      <header className="w-full pt-7  border-gray-200 min-[400px]:border-hidden">
        {getDetailData.isLoading ? (
          <div className="h-14 mb-3 bg-gray-200 rounded-lg w-28" />
        ) : (
          <h1 className="mr-1 text-xl  text-ftBlack mobile:text-3xl tablet:text-6xl ">
            {getDetailData?.data?.post.title}
          </h1>
        )}
      </header>
      <section className=" flex items-center justify-between w-full h-full border-b border-gray-400 ">
        <div className="flex flex-wrap justify-start w-full text-ftBlack h-9">
          {getDetailData.isLoading ? (
            <>
              <div className="h-6 mt-2 ml-2 bg-gray-200 rounded-lg w-16" />
              <div className="h-6 mt-2 ml-2 bg-gray-200 rounded-lg w-16" />
              <div className="h-6 mt-2 ml-2 bg-gray-200 rounded-lg w-16" />
            </>
          ) : (
            getDetailData.data?.post.tags.map((tag: TagType) => (
              <Badge
                className="relative flex items-center px-3  mx-2 mt-1 rounded-full border-2 border-blue-300 bg-blue-200 text-blue-800 hover:bg-blue-200 hover:border-blue-400 transition-all duration-300"
                color="default"
                size="sm"
                key={tag.id}
              >
                <Link href={{ pathname: '/article', query: { tagKeyword: tag.name } }}>
                  <span className="cursor-pointer">{tag.name}</span>
                </Link>
              </Badge>
            ))
          )}
        </div>
        <section className="flex items-end w-28">
          <time className="text-xs text-gray-600 tablet:text-sm mb-1">
            {getDetailData && getDetailData.data?.post.created_at.slice(0, 10)}
          </time>
        </section>
      </section>
      <main className="w-full h-full tablet:pb-12">
        <section>
          <div className="flex justify-end w-full">
            <article className="flex flex-row mt-1 mr-1 tablet:mt-1 tablet:m-0">
              {userInfo?.id === getDetailData?.data?.post.user_id.id ||
              userInfo?.github_id ===
                getDetailData?.data?.post?.user_id?.github_id.id ? (
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
              data={getDetailData.data?.post.content}
              isLoading={getDetailData.isLoading}
              writer={getDetailData?.data?.post.user_id.github_id}
              id={getDetailData.data?.post.id}
            />
          </div>
        </section>
      </main>
      <section className="relative flex justify-between w-full pb-2 border-b border-gray-400 mobile:pb-5 mt-7">
        <article className="mb-4 mobile:mb-0">
          <Profile getDetailData={getDetailData?.data?.post.user_id} />
        </article>
        <div className="flex items-center justify-around tablet:w-128 w-60">
          {getDetailData.data?.prevPostInfo ? (
            <Link href={`/article/content/all/${getDetailData.data.prevPostInfo.id}`} prefetch>
              <div className="tablet:py-8 flex items-center w-1/2 h-8 bg-gray-200 rounded-md cursor-pointer mobile:ml-6 text-ftBlack hover:opacity-70 mobile:h-12 tablet:ml-10 justify-evenly">
                <div className="pr-2 tablet:ml-3">←</div>
                <div className="flex-col hidden w-[90px] tablet:w-full mobile:flex truncate">
                  <div className="text-xs text-center tablet:text-sm">이전 포스트</div>
                  <div className="h-5 mx-1 overflow-hidden text-sm font-bold text-center tablet:text-base flex-nowrap mt-[2px] truncate">
                    {getDetailData.data.prevPostInfo.title}
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div className="tablet:py-8 flex items-center w-1/2 h-8 bg-gray-200 rounded-md cursor-not-allowed mobile:ml-6 text-ftBlack opacity-50 mobile:h-12 tablet:ml-10 justify-evenly" />
          )}
          
          {getDetailData.data?.nextPostInfo ? (
            <Link href={`/article/content/all/${getDetailData.data.nextPostInfo.id}`} prefetch>
              <div className="tablet:py-8 flex items-center w-1/2 h-8 ml-1 bg-gray-200 rounded-md cursor-pointer text-ftBlack hover:opacity-70 mobile:h-12 justify-evenly">
                <div className="flex-col hidden w-[90px] tablet:w-full mobile:flex truncate">
                  <div className="text-xs text-center tablet:text-sm">다음 포스트</div>
                  <div className="h-5 mx-1 overflow-hidden text-sm font-bold text-center tablet:text-base flex-nowrap mt-[2px] truncate">
                    {getDetailData.data.nextPostInfo.title}
                  </div>
                </div>
                <div className="w-100% mr-1 tablet:mr-3">→</div>
              </div>
            </Link>
          ) : (
            <div className="tablet:py-8 flex items-center w-1/2 h-8 ml-1 bg-gray-200 rounded-md cursor-not-allowed text-ftBlack opacity-50 mobile:h-12 justify-evenly" />
          )}
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
    // 여기서 초기 데이터를 미리 가져올 수 있습니다
    // const initialData = await fetchInitialData(pid);

    return {
      props: {
        pid,
      },
      revalidate: 60, // 60초마다 재검증
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
