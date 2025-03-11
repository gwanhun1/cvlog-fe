import React from 'react';
import { GetServerSideProps } from 'next';
import { useGetCommentList } from 'service/hooks/Comment';
import { useQueryClient } from 'react-query';
import CommentItem from './Comment';
import CommentWrite from './CommentWrite';
import CommentLayout from './CommentLayout';
import { CommentProps } from 'service/api/comment/type';

const CommentBox = ({ pid }: { pid: string }) => {
  const { data: commentListData, refetch } = useGetCommentList(parseInt(pid));
  const queryClient = useQueryClient();

  const forceRefresh = React.useCallback(async () => {
    await queryClient.invalidateQueries(['commentList']);
    await refetch();
    try {
      const response = await fetch(`/api/comments/${pid}`);
      if (response.ok) {
        const data = await response.json();
        queryClient.setQueryData(['commentList'], data);
      }
    } catch (error) {
      console.error('Failed to refresh comments:', error);
    }
  }, [pid, queryClient, refetch]);

  React.useEffect(() => {
    // @ts-ignore
    window.refetchComments = forceRefresh;
  }, [forceRefresh]);

  const sortedComments = React.useMemo(() => {
    if (!commentListData) return [];
    return [...commentListData].sort((a, b) => {
      return (
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    });
  }, [commentListData]);

  return (
    <section className="flex flex-col w-full p-1 tablet:mt-3 ">
      <h2 className="flex justify-start my-2 ml-1 text-xs mobile:text-base text-ftBlack">
        {commentListData ? commentListData.length : 0} 개의 댓글
      </h2>
      <article>
        {sortedComments.map(
          (comment: React.JSX.IntrinsicAttributes & CommentProps) => (
            <CommentLayout key={comment.id}>
              <CommentItem {...comment} refetch={forceRefresh} />
            </CommentLayout>
          )
        )}
      </article>
      <CommentWrite pid={pid} refetch={forceRefresh} />
    </section>
  );
};

export default CommentBox;

export const getServerSideProps: GetServerSideProps = async context => {
  const pid = context.params?.pid;
  return { props: { pid } };
};
