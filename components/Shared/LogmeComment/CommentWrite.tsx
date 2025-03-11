import * as Shared from 'components/Shared';
import React, { ChangeEvent, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userIdAtom } from 'service/atoms/atoms';
import { useGetCommentList, usePostNewComment } from 'service/hooks/Comment';

const CommentWrite = ({ pid, refetch: parentRefetch }: { pid: string; refetch: () => void }) => {
  const [comment, setComment] = useState('');
  const { refetch } = useGetCommentList(parseInt(pid));
  const postNewComment = usePostNewComment();
  const userInfo = useRecoilValue(userIdAtom);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setComment(e.target.value);

  const handleSubmit = () => {
    if (!comment.trim()) return alert('댓글을 작성해주세요.');
    if (!window.confirm('정말 작성합니까?')) return;

    postNewComment.mutate(
      { post_id: parseInt(pid), content: comment },
      {
        onSuccess: () => {
          setComment('');
          refetch();
          parentRefetch();
          alert('작성되었습니다.');
        }
      }
    );
  };

  return (
    <>
      <textarea
        spellCheck="false"
        className="flex justify-center w-full px-2 py-2 mt-1 bg-gray-200 mobile:mt-2 mobile:py-5 text-ftBlack rounded-2xl border-2 border-blue-300 placeholder:text-gray-400 placeholder:font-light focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300 hover:border-blue-300"
        onChange={handleChange}
        value={comment}
      />
      <div className="flex justify-end mt-1 mobile:mt-2 mobile:mb-5">
        <Shared.LogmeButton
          variant={userInfo.github_id === '' ? 'disabled' : 'classic'}
          size="medium"
          onClick={handleSubmit}
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
