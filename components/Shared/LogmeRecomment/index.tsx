import React from 'react';
import axios from 'axios';
import { Avatar } from 'flowbite-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import CommentLayout from 'components/Shared/LogmeComment/CommentLayout';
import LocalStorage from 'public/utils/Localstorage';
import { useToast } from 'components/Shared';

interface ReCommentProps {
  reComment: ReCommentType;
}

export interface ReComment {
  id: number;
  comment: string;
  profile_image: string;
  name: string;
}
export interface ReCommentType {
  reComment: ReComment[];
}

const ReComment = ({ reComment }: ReCommentProps) => {
  const accessToken = LocalStorage.getItem('LogmeToken') as string;
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  //삭제 기능
  const deleteComment = useMutation({
    mutationFn: (id: number) => {
      return axios.delete(`api/${id}`, {
        data: { Authorization: accessToken },
      });
    },
    onSuccess: () => {
      showToast('삭제되었습니다.', 'success');
    },
    onError: ({ message }: any) => {
      console.log(message);
      showToast('삭제에 실패했습니다.', 'error');
    },
  });

  //수정 기능
  const updateComment = useMutation({
    mutationFn: (id: number) => {
      return axios.put(`api/${id}`, { data: { Authorization: accessToken } });
    },
    onSuccess: () => {
      showToast('수정되었습니다.', 'success');
    },
    onError: ({ message }: any) => {
      console.log(message);
      showToast('수정에 실패했습니다.', 'error');
    },
  });

  return (
    <>
      {reComment.reComment.map(
        ({ id, profile_image, name, comment }: ReComment) => (
          <CommentLayout key={id}>
            <div className="mobile:mt-3">
              <div className="flex justify-between w-full">
                <Avatar
                  img={profile_image}
                  rounded={true}
                  className="flex justify-start"
                >
                  <div className="space-y-1 font-medium dark:text-white">
                    <div className="text-[11px] tablet:text-base text-ftBlack">
                      {name}
                    </div>

                    <div className="h-5 text-[5px] tablet:text-xs overflow-hidden  text-gray-500 w-28 tablet:w-40 desktop:w-80 dark:text-gray-400">
                      {formatDate(new Date())}
                    </div>
                  </div>
                </Avatar>
                <section className="flex">
                  <article className="flex flex-row mt-1 mr-1 tablet:mt-1 tablet:m-0">
                    <div
                      className="m-1 text-[10px] cursor-pointer tablet:p-1 tablet:text-sm hover:text-blue-400 text-ftBlack"
                      onClick={() => {
                        updateComment.mutate(id);
                      }}
                    >
                      수정
                    </div>
                    <div
                      className="m-1 text-[10px] cursor-pointer tablet:p-1 tablet:text-sm hover:text-blue-400 text-ftBlack"
                      onClick={() => {
                        deleteComment.mutate(id);
                        queryClient.invalidateQueries({
                          predicate: (query) => query.queryKey[0] === 'commentList',
                        });
                      }}
                    >
                      삭제
                    </div>
                  </article>
                </section>
              </div>
              <main className="p-2 pl-6 w-full text-sm tablet:text-base mobile:text-md desktop:py-5 text-ftBlack">
                {comment}
              </main>
            </div>
          </CommentLayout>
        )
      )}
    </>
  );
};

export default ReComment;



const formatDate = (date: Date) =>
  Intl.DateTimeFormat('ko-KR', {
    year: '2-digit',
    month: 'narrow',
    day: 'numeric',
    localeMatcher: 'lookup',
  }).format(date);
