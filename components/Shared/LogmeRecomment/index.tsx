import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from 'utils/axios';
import CommentLayout from 'components/Shared/LogmeComment/CommentLayout';
import { useToast } from 'components/Shared';
import { useStore } from 'service/store/useStore';

interface ReCommentProps {
  reComment: ReCommentType;
}

export interface ReComment {
  id: number;
  comment: string;
  profile_image: string;
  name: string;
  created_at: string;
}
export interface ReCommentType {
  reComment: ReComment[];
}

const formatDate = (date: Date) =>
  Intl.DateTimeFormat('ko-KR', {
    year: '2-digit',
    month: 'narrow',
    day: 'numeric',
    localeMatcher: 'lookup',
  }).format(date);

const ReComment = ({ reComment }: ReCommentProps) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const currentUserName = useStore((state) => state.userIdAtom.name);

  const deleteComment = useMutation({
    mutationFn: (id: number) => axiosInstance.delete(`/comments/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: q => q.queryKey[0] === 'commentList',
      });
      showToast('삭제되었습니다.', 'success');
    },
    onError: () => {
      showToast('삭제에 실패했습니다.', 'error');
    },
  });

  return (
    <>
      {reComment.reComment.map(({ id, profile_image, name, comment, created_at }: ReComment) => (
        <CommentLayout key={id}>
          <div className="mobile:mt-3">
            <div className="flex justify-between w-full">
              <div className="flex items-center gap-3">
                <img
                  src={profile_image}
                  alt={name}
                  className="w-9 h-9 rounded-full flex-shrink-0 object-cover"
                  onError={e => {
                    (e.target as HTMLImageElement).src =
                      'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
                  }}
                />
                <div className="flex flex-col space-y-0.5">
                  <span className="text-[11px] tablet:text-base text-ftBlack font-medium">
                    {name}
                  </span>
                  <span className="text-[10px] tablet:text-xs text-gray-500">
                    {formatDate(new Date(created_at))}
                  </span>
                </div>
              </div>
              {currentUserName && currentUserName === name && (
                <section className="flex">
                  <article className="flex flex-row mt-1 mr-1 tablet:mt-1 tablet:m-0">
                    <button
                      className="m-1 text-[10px] cursor-pointer tablet:p-1 tablet:text-sm hover:text-blue-400 text-ftBlack"
                      onClick={() => deleteComment.mutate(id)}
                    >
                      삭제
                    </button>
                  </article>
                </section>
              )}
            </div>
            <main className="p-2 pl-6 w-full text-sm tablet:text-base mobile:text-md desktop:py-5 text-ftBlack">
              {comment}
            </main>
          </div>
        </CommentLayout>
      ))}
    </>
  );
};

export default ReComment;
