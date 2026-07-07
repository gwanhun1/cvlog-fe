import React, { ChangeEvent, useState } from 'react';
import { useToast } from 'components/Shared';
import { useStore } from 'service/store/useStore';
import { useGetCommentList, usePostNewComment } from 'service/hooks/Comment';
import useIsLogin from 'hooks/useIsLogin';
import Link from 'next/link';

const CommentWrite = ({
  pid,
  refetch: parentRefetch,
}: {
  pid: string;
  refetch: () => void;
}) => {
  const [comment, setComment] = useState('');
  const { refetch } = useGetCommentList(parseInt(pid));
  const postNewComment = usePostNewComment();
  const userInfo = useStore(state => state.userIdAtom);
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 스토어의 유저 정보만 믿으면 세션 만료 후에도 입력창이 노출된다.
  // 실제 토큰 보유(useIsLogin)까지 확인한다.
  const { isAuthenticated } = useIsLogin();
  const isLoggedIn = isAuthenticated && !!userInfo?.github_id;

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value);

  const handleSubmit = () => {
    if (!comment.trim()) {
      showToast('댓글 내용을 입력해주세요.', 'warning');
      return;
    }
    if (isSubmitting) return;

    setIsSubmitting(true);
    postNewComment.mutate(
      { post_id: parseInt(pid), content: comment },
      {
        onSuccess: () => {
          setComment('');
          refetch();
          parentRefetch();
          showToast('댓글이 등록되었습니다.', 'success');
        },
        onError: () => showToast('댓글 등록에 실패했습니다.', 'error'),
        onSettled: () => setIsSubmitting(false),
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center gap-3 py-6 mt-4 rounded-xl border border-dashed border-gray-200 bg-gray-50">
        <span className="text-sm text-gray-400">댓글을 작성하려면</span>
        <Link
          href="/login"
          className="px-4 py-1.5 text-sm font-semibold text-white bg-ftBlue rounded-lg hover:bg-[#1f4a8c] transition-colors"
        >
          로그인
        </Link>
        <span className="text-sm text-gray-400">이 필요합니다.</span>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-start gap-3">
        <img
          src={userInfo.profile_image || '/images/github.png'}
          alt={userInfo.github_id}
          className="w-8 h-8 rounded-full flex-shrink-0 object-cover mt-1"
        />
        <div className="flex-1 space-y-2">
          <textarea
            spellCheck={false}
            placeholder={`${userInfo.github_id}님, 댓글을 남겨보세요. (Ctrl+Enter로 제출)`}
            className="w-full px-3 py-2.5 text-sm text-ftBlack bg-white rounded-xl border border-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-ftBlue/20 focus:border-ftBlue/40 transition-all resize-none"
            rows={3}
            value={comment}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={isSubmitting}
          />
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !comment.trim()}
              className="px-4 py-2 text-sm font-semibold text-white bg-ftBlue rounded-lg hover:bg-[#1f4a8c] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '등록 중...' : '댓글 등록'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentWrite;
