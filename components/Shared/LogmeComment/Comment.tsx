import React from 'react';
import { Avatar } from 'flowbite-react';
import { CommentProps } from 'service/api/comment/type';
import { useDeleteComment, useModifyComment } from 'service/hooks/Comment';

const CommentItem = ({ id, content, user_id, created_at }: CommentProps) => {
  const modify = useModifyComment(id);
  const remove = useDeleteComment(id);
  //수정
  const modifyComment = () => {
    modify.mutate();
  };

  //삭제
  const deletComent = () => {
    remove.mutate();
  };

  return (
    <article className="mt-2 border-b border-gray-300 mobile:mt-5">
      <div className="flex flex-col">
        <div className="flex items-center justify-between ">
          <div className="flex items-center">
            <Avatar
              img={user_id.profile_image}
              rounded={true}
              className="flex justify-start "
            >
              <div className="flex flex-col space-y-1 font-medium dark:text-white">
                <div className="text-[11px] tablet:text-base text-ftBlack">
                  {user_id.github_id}
                </div>
                <time className="text-[5px] tablet:text-xs overflow-hidden text-gray-500 w-28 tablet:w-40 desktop:w-80 dark:text-gray-400">
                  {created_at.slice(0, 10)}
                </time>
              </div>
            </Avatar>
          </div>
          <section className="flex ">
            <article className="flex flex-row mt-1 mr-1 tablet:mt-1 tablet:m-0">
              <button
                className="m-1 text-[10px] cursor-pointer tablet:p-1 tablet:text-sm hover:text-blue-400 text-ftBlack "
                onClick={() => modifyComment()}
              >
                수정
              </button>
              <button
                className="m-1 text-[10px] cursor-pointer tablet:p-1 tablet:text-sm hover:text-red-400 text-ftBlack"
                onClick={() => deletComent()}
              >
                삭제
              </button>
            </article>
          </section>
        </div>
      </div>
      <div className="w-full p-2 pl-6 text-sm desktop:py-5 tablet:text-base mobile:text-md text-ftBlack">
        {content}
      </div>
      {/* FIXME 대댓글 기능 구현 후 수정
      {!write ? (
        <div
          className="w-16 p-1 mb-2 ml-5 text-[10px] text-center bg-blue-500 rounded-sm cursor-pointer tablet:p-2 tablet:w-24 tablet:text-sm hover:opacity-70"
          onClick={() => setWrite(!write)}
        >
          + 답글 달기
        </div>
      ) : (
        <>
          <div
            className="w-16 p-1 ml-5 text-[10px] text-center bg-red-500 rounded-sm cursor-pointer tablet:p-2 tablet:w-24 tablet:text-sm hover:opacity-70"
            onClick={() => setWrite(!write)}
          >
            - 답글 닫기
          </div>
          <CommentWrite />
        </>
      )}
      {recomment.length > 0 && <ReComment id={id} recomment={recomment} />} */}
    </article>
  );
};

export default CommentItem;

//FIXME 백엔드 통신 시 삭제 될 목 데이터입니다.

const formatDate = (date: Date) =>
  Intl.DateTimeFormat('ko-KR', {
    year: '2-digit',
    month: 'narrow',
    day: 'numeric',
    localeMatcher: 'lookup',
  }).format(date);
