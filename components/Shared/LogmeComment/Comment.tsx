import React, { ChangeEvent, useState } from 'react';
import { Avatar } from 'flowbite-react';
import { CommentProps } from 'service/api/comment/type';
import { useDeleteComment, useModifyComment } from 'service/hooks/Comment';
import { useQueryClient } from '@tanstack/react-query';
import { useStore } from 'service/store/useStore';

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

  const [isEditing, setIsEditing] = useState(false);
  const [modifiedComment, setModifiedComment] = useState(content);

  const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setModifiedComment(e.target.value);
  };

  const handleModifyClick = () => {
    if (!isEditing) {
      setIsEditing(true);
    } else {
      if (!modifiedComment.trim()) {
        alert('댓글 내용을 입력해주세요.');
        return;
      }
      if (isSubmitting) return;
      if (window.confirm('정말 수정합니까?')) {
        setIsSubmitting(true);
        modifyMutate.mutate(modifiedComment, {
          onSuccess: () => {
            queryClient.invalidateQueries({
              predicate: query => query.queryKey[0] === 'commentList',
            });
            if (refetch) refetch();
            setIsEditing(false);
          },
          onSettled: () => {
            setIsSubmitting(false);
          },
        });
      } else {
        setIsEditing(false);
      }
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeleteComment = () => {
    if (isSubmitting) return;
    if (window.confirm('정말 삭제합니까?')) {
      setIsSubmitting(true);
      removeMutate.mutate(undefined, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: query => query.queryKey[0] === 'commentList',
          });
          if (refetch) refetch();
        },
        onSettled: () => {
          setIsSubmitting(false);
        },
      });
    }
  };

  const isDeletedUser = !user;
  const profileImage = isDeletedUser
    ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
    : user.profile_image;
  const githubId = isDeletedUser ? '탈퇴한 사용자' : user.github_id;

  return (
    <article className="mt-2 border-b border-gray-300 mobile:mt-5">
      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Avatar img={profileImage} rounded>
              <div className="flex flex-col space-y-1 font-medium dark:text-white">
                <div className="text-[11px] tablet:text-base text-ftBlack">
                  {githubId}
                </div>
                <time className="text-[5px] tablet:text-xs text-gray-500 dark:text-gray-400 w-28 tablet:w-40 desktop:w-80">
                  {created_at.slice(0, 10)}
                </time>
              </div>
            </Avatar>
          </div>
          {user && userInfo?.github_id === user.github_id && (
            <div className="flex">
              <button
                className="m-1 text-[10px] tablet:p-1 tablet:text-sm hover:text-blue-400 text-ftBlack disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleModifyClick}
                disabled={isSubmitting}
              >
                {isEditing ? '저장' : '수정'}
              </button>
              <button
                className="m-1 text-[10px] tablet:p-1 tablet:text-sm hover:text-red-400 text-ftBlack disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleDeleteComment}
                disabled={isSubmitting}
              >
                삭제
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="p-2 pl-6 w-full text-sm desktop:py-5 tablet:text-base mobile:text-md text-ftBlack">
        {isEditing ? (
          <textarea
            style={{ border: '1px solid gray' }}
            className="p-2 w-full text-gray-600 rounded-md border border-gray-400"
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
