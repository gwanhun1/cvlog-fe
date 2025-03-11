import React, { ChangeEvent, useState } from 'react';
import { Avatar } from 'flowbite-react';
import { CommentProps } from 'service/api/comment/type';
import { useDeleteComment, useModifyComment } from 'service/hooks/Comment';
import { useQueryClient } from 'react-query';
import { useRecoilValue } from 'recoil';
import { userIdAtom } from 'service/atoms/atoms';

const CommentItem = ({ 
  id, 
  content, 
  user_id, 
  created_at, 
  refetch 
}: CommentProps & { refetch?: () => void }) => {
  const modifyMutate = useModifyComment(id);
  const removeMutate = useDeleteComment(id);
  const queryClient = useQueryClient();
  const userInfo = useRecoilValue(userIdAtom);

  const [isEditing, setIsEditing] = useState(false);
  const [modifiedComment, setModifiedComment] = useState(content);

  const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setModifiedComment(e.target.value);
  };

  const handleModifyClick = () => {
    if (!isEditing) {
      setIsEditing(true);
    } else {
      if (window.confirm('정말 수정합니까?')) {
        modifyMutate.mutate(modifiedComment, {
          onSuccess: () => {
            queryClient.invalidateQueries(['commentList']);
            if (refetch) refetch();
            setIsEditing(false);
          }
        });
      } else {
        setIsEditing(false);
      }
    }
  };

  const handleDeleteComment = () => {
    if (window.confirm('정말 삭제합니까?')) {
      removeMutate.mutate(undefined, {
        onSuccess: () => {
          queryClient.invalidateQueries(['commentList']);
          if (refetch) refetch();
        }
      });
    }
  };

  return (
    <article className="mt-2 border-b border-gray-300 mobile:mt-5">
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar img={user_id.profile_image} rounded>
              <div className="flex flex-col space-y-1 font-medium dark:text-white">
                <div className="text-[11px] tablet:text-base text-ftBlack">
                  {user_id.github_id}
                </div>
                <time className="text-[5px] tablet:text-xs text-gray-500 dark:text-gray-400 w-28 tablet:w-40 desktop:w-80">
                  {created_at.slice(0, 10)}
                </time>
              </div>
            </Avatar>
          </div>
          {userInfo?.github_id === user_id.github_id && (
            <div className="flex">
              <button
                className="m-1 text-[10px] tablet:p-1 tablet:text-sm hover:text-blue-400 text-ftBlack"
                onClick={handleModifyClick}
              >
                {isEditing ? '저장' : '수정'}
              </button>
              <button
                className="m-1 text-[10px] tablet:p-1 tablet:text-sm hover:text-red-400 text-ftBlack"
                onClick={handleDeleteComment}
              >
                삭제
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="w-full p-2 pl-6 text-sm desktop:py-5 tablet:text-base mobile:text-md text-ftBlack">
        {isEditing ? (
          <textarea
            style={{ border: '1px solid gray' }}
            className="w-full text-gray-600 rounded-md p-2 border border-gray-400"
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
