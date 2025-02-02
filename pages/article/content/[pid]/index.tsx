import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQueryClient } from 'react-query';
import CommentBox from 'components/Shared/LogmeComment';
import Tag from 'components/Shared/LogmeTag';
import { useGetCommentList } from 'service/hooks/Comment';
import {
  DeleteDetail,
  useGetDetail,
  usePatchDetail,
} from 'service/hooks/Detail';
import Content from './content';
import Profile from './Profile';

const Detail = ({ pid }: { pid: string }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [patchMessage, setPatchMessage] = useState(false);

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

      if (newPublicStatus) {
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
  }, [pid]);

  return (
    <div className="flex justify-center ">
      <div className="flex flex-col items-center  justify-center rounded-lg my-7 tablet:my-15 w-full">
        <header className="flex justify-between w-full py-2 border-b-[0.5px] border-gray-200 min-[400px]:border-hidden tablet:pl-2 ">
          <h1 className="mr-1 text-xl truncate text-ftBlick mobile:text-3xl tablet:text-4xl ">
            {getDetailData?.data?.post.title}
          </h1>
          <div className="flex items-end flex-col">
            <div className="flex flex-row justify-center text-sm w-16 tablet:text-base">
              <div
                className="cursor-pointer hover:text-blue-400 text-ftBlick "
                onClick={() => {
                  updateCheck();
                }}
              >
                수정
              </div>
              <div
                className="ml-1 cursor-pointer hover:text-blue-400 text-ftBlick"
                onClick={() => {
                  deleteCheck();
                }}
              >
                삭제
              </div>
            </div>
            <time className="text-xs text-gray-600 tablet:text-sm ">
              {getDetailData &&
                getDetailData.data?.post.created_at.slice(0, 10)}
            </time>
          </div>
        </header>
        <section className="flex items-center justify-between w-full h-full py-2 border-b border-gray-400 ">
          <div
            className="flex flex-wrap justify-start w-full mr-1 text-ftBlick "
            onClick={() => alert('v1.1에서 만나요 🥰')}
          >
            {getDetailData.data?.post.tags.map((tag: TagType) => (
              <Tag id={tag.id} name={tag.name} key={tag.id} />
            ))}
          </div>
        </section>
        <main className="w-full h-full pt-3 tablet:pb-12">
          <section>
            <div className="flex justify-end w-full">
              <button
                className="flex justify-end text-gray-600 cursor-pointer hover:text-blue-400 text-sm w-16 mr-1"
                onClick={() => {
                  handlePrivateToggle();
                }}
              >
                {patchMessage ? '공개' : '나만보기'}
              </button>
            </div>
            <div className="flex justify-center">
              {getDetailData.data && (
                <Content data={getDetailData.data?.post.content} />
              )}
            </div>
          </section>
        </main>
        <section className="flex justify-between w-full px-5 pb-2 border-b border-gray-400 mobile:pb-5 mt-7">
          <article className="mb-4 mobile:mb-0">
            <Profile />
          </article>
          <div className="flex items-center justify-around tablet:w-96 w-60">
            <div
              className={`${
                !getDetailData.data?.prevPostInfo && 'hover:cursor-not-allowed'
              } flex items-center w-1/2 h-8 bg-gray-200 rounded-md cursor-pointer mobile:ml-6 text-ftBlick hover:opacity-70 mobile:h-12 tablet:ml-10 justify-evenly`}
            >
              {getDetailData.data?.prevPostInfo && (
                <Link
                  href={`/article/content/${getDetailData.data?.prevPostInfo.id}`}
                  className="flex items-center cursor-pointer hover:opacity-70 "
                >
                  <div className="ml-1 tablet:ml-3">←</div>
                  <div className="flex-col hidden w-[90px] tablet:w-full mobile:flex truncate">
                    <div className="text-xs text-center tablet:text-sm ">
                      이전 포스트
                    </div>
                    <div className="h-5 mx-1 overflow-hidden text-sm font-bold text-center tablet:text-base flex-nowrap tablet:w-32 mt-[2px]">
                      {getDetailData.data.prevPostInfo.title}
                    </div>
                  </div>
                </Link>
              )}
            </div>
            <div
              className={`${
                !getDetailData.data?.nextPostInfo && 'hover:cursor-not-allowed'
              } flex items-center w-1/2 h-8 ml-1 bg-gray-200 rounded-md cursor-pointer text-ftBlick mobile:h-12 justify-evenly hover:opacity-70 `}
            >
              {getDetailData.data?.nextPostInfo && (
                <Link
                  href={`/article/content/${getDetailData.data?.nextPostInfo?.id}`}
                  className="flex items-center cursor-pointer hover:opacity-70"
                >
                  <div className="flex-col hidden w-[90px] tablet:w-full mobile:flex truncate">
                    <div className="text-xs text-center tablet:text-sm">
                      다음 포스트
                    </div>
                    <div className="h-5 mx-1 overflow-hidden text-sm font-bold text-center tablet:text-base flex-nowrap tablet:w-32 mt-[2px]">
                      {getDetailData.data.nextPostInfo.title}
                    </div>
                  </div>
                  <div className="w-100%  mr-1 tablet:mr-3 ">→</div>
                </Link>
              )}
            </div>
          </div>
        </section>
        <CommentBox pid={pid} />
      </div>
    </div>
  );
};

export default Detail;

export const getServerSideProps: GetServerSideProps = async context => {
  const pid = context.params?.pid;
  return { props: { pid } };
};
export interface Content {
  success: boolean;
  data: {
    post: ContentData;
    prevPostInfo: {
      id: number;
      title: string;
    } | null;
    nextPostInfo: {
      id: number;
      title: string;
    } | null;
  };
}

export interface ContentData {
  id: number;
  title: string;
  content: string;
  user_id: number;
  public_status: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  tags: TagType[];
}

export interface TagType {
  id: number;
  name: string;
}

export interface ContentParams {
  content_id: number;
}
