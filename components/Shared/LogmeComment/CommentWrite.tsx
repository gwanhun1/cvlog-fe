import React, { ChangeEvent, useState } from 'react';
import { useGetCommentList, usePostNewComment } from 'service/hooks/Comment';

const CommentWrite = ({ pid }: { pid: string }) => {
  const [comment, setComment] = useState<string>('');
  const commentList = useGetCommentList(parseInt(pid));

  const commentHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const valueToForm = (comment: string, pid: number) => {
    return {
      post_id: pid,
      content: comment,
    };
  };

  const postNewComment = usePostNewComment();

  return (
    <>
      <textarea
        spellCheck="false"
        className="flex justify-center w-full px-2 py-2 mt-1 bg-gray-200 rounded-lg mobile:mt-2 mobile:py-5 text-ftBlick backdrop-blur-sm rounded-2xl border-2 border-blue-300 shadow-[0_0_15px_rgba(0,0,0,0.1)] placeholder:text-gray-400 placeholder:font-light focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.15)] hover:border-blue-300"
        onChange={e => {
          commentHandler(e);
        }}
        value={comment}
      />
      <div className="flex justify-end mt-1 mobile:mt-2 mobile:mb-5  ">
        <button
          className=" w-full p-1 text-xs text-center bg-blue-500 rounded-md cursor-pointer tablet:p-2 tablet:w-1/6 tablet:text-base hover:opacity-70 text-white"
          onClick={() => {
            if (window.confirm('정말 작성합니까?')) {
              postNewComment.mutate(valueToForm(comment, parseInt(pid)));
              setComment('');
              commentList.refetch();
              alert('작성되었습니다.');
            } else {
              alert('취소합니다.');
            }
          }}
        >
          댓글 작성
        </button>
      </div>
    </>
  );
};

export default CommentWrite;
