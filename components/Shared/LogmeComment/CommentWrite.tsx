import * as Shared from 'components/Shared';
import React, { ChangeEvent, useState } from 'react';
import { useGetCommentList, usePostNewComment } from 'service/hooks/Comment';

const CommentWrite = ({ pid }: { pid: string }) => {
  const [comment, setComment] = useState<string>('');
  const { refetch: refetchComments } = useGetCommentList(parseInt(pid));
  const postNewComment = usePostNewComment();

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setComment(e.target.value);

  const handleCommentSubmission = () => {
    if (!comment) {
      alert('댓글을 작성해주세요.');
      return;
    }

    if (window.confirm('정말 작성합니까?')) {
      postNewComment.mutate(createCommentPayload(comment, parseInt(pid)));
      resetForm();
      refetchComments();
      alert('작성되었습니다.');
    } else {
      alert('취소합니다.');
    }
  };

  const createCommentPayload = (comment: string, pid: number) => ({
    post_id: pid,
    content: comment,
  });

  const resetForm = () => setComment('');

  return (
    <>
      <textarea
        spellCheck="false"
        className="flex justify-center w-full px-2 py-2 mt-1 bg-gray-200  mobile:mt-2 mobile:py-5 text-ftBlick backdrop-blur-sm rounded-2xl border-2 border-blue-300 shadow-[0_0_15px_rgba(0,0,0,0.1)] placeholder:text-gray-400 placeholder:font-light focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.15)] hover:border-blue-300"
        onChange={handleChange}
        value={comment}
      />
      <div className="flex justify-end mt-1 mobile:mt-2 mobile:mb-5">
        <Shared.LogmeButton
          variant="classic"
          size="medium"
          onClick={handleCommentSubmission}
        >
          <Shared.LogmeHeadline
            type="medium"
            fontStyle="semibold"
            style={{ color: '#fff' }}
          >
            댓글 작성
          </Shared.LogmeHeadline>
        </Shared.LogmeButton>
      </div>
    </>
  );
};

export default CommentWrite;
