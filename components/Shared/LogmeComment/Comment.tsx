import React, { ChangeEvent, useState } from 'react';
import { CommentProps } from 'service/api/comment/type';
import { useDeleteComment, useModifyComment } from 'service/hooks/Comment';
import { useQueryClient } from '@tanstack/react-query';
import { useStore } from 'service/store/useStore';
import { useToast } from 'components/Shared';

const CommentItem = ({
  id,
  content,
  user,
  created_at,
  refetch,
}: CommentProps & { refetch?: () => void }) => {
  const modifyMutate = useModifyComment(id);
  const removeMutate = useDeleteComment(id);
  const queryClient = useQueryClient();
  const userInfo = useStore(state => state.userIdAtom);
  const { showToast, showConfirm } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [modifiedComment, setModifiedComment] = useState(content);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setModifiedComment(e.target.value);
  };

  const handleModifyClick = () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    if (!modifiedComment.trim()) {
      showToast('댓글 내용을 입력해주세요.', 'warning');
      return;
    }
    if (isSubmitting) return;

    showConfirm('댓글을 수정하시겠습니까?', () => {
      setIsSubmitting(true);
      modifyMutate.mutate(modifiedComment, {
        onSuccess: () => {
          queryClient.invalidateQueries({ predicate: q => q.queryKey[0] === 'commentList' });
          if (refetch) refetch();
          setIsEditing(false);
          showToast('댓글이 수정되었습니다.', 'success');
        },
        onSettled: () => setIsSubmitting(false),
      });
    });
  };

  const handleDeleteComment = () => {
    if (isSubmitting) return;
    showConfirm('댓글을 삭제하시겠습니까?', () => {
      setIsSubmitting(true);
      removeMutate.mutate(undefined, {
        onSuccess: () => {
          queryClient.invalidateQueries({ predicate: q => q.queryKey[0] === 'commentList' });
          if (refetch) refetch();
          showToast('댓글이 삭제되었습니다.', 'success');
        },
        onSettled: () => setIsSubmitting(false),
      });
    });
  };

  const isDeletedUser = !user;
  const profileImage = isDeletedUser
    ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
    : user.profile_image;
  const githubId = isDeletedUser ? '탈퇴한 사용자' : user.github_id;

  return (
    <article className="py-3 border-b border-gray-100 last:border-0">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <img
            src={profileImage}
            alt={githubId}
            className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
            onError={e => {
              (e.target as HTMLImageElement).src =
                'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
            }}
          />
          <div>
            <span className="text-sm font-semibold text-ftBlack">{githubId}</span>
            <time className="block text-xs text-gray-400 mt-0.5">{created_at.slice(0, 10)}</time>
          </div>
        </div>

        {user && userInfo?.github_id === user.github_id && (
          <div className="flex items-center gap-1">
            <button
              className="px-2.5 py-1 text-xs font-medium text-gray-500 rounded-lg hover:bg-gray-100 hover:text-ftBlue transition-colors disabled:opacity-40"
              onClick={handleModifyClick}
              disabled={isSubmitting}
            >
              {isEditing ? '저장' : '수정'}
            </button>
            {isEditing ? (
              <button
                className="px-2.5 py-1 text-xs font-medium text-gray-400 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => { setIsEditing(false); setModifiedComment(content); }}
              >
                취소
              </button>
            ) : (
              <button
                className="px-2.5 py-1 text-xs font-medium text-red-400 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-40"
                onClick={handleDeleteComment}
                disabled={isSubmitting}
              >
                삭제
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-2 pl-11 text-sm text-ftBlack leading-relaxed">
        {isEditing ? (
          <textarea
            className="w-full p-2 text-sm text-gray-700 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ftBlue/30 focus:border-ftBlue/50 resize-none"
            rows={3}
            value={modifiedComment}
            onChange={handleCommentChange}
          />
        ) : (
          content
        )}
      </div>
    </article>
  );
};

export default CommentItem;
