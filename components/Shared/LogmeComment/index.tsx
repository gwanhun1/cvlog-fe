import React from 'react';
import { GetServerSideProps } from 'next';
import { useGetCommentList } from 'service/hooks/Comment';
import { useQueryClient } from '@tanstack/react-query';
import CommentItem from './Comment';
import CommentWrite from './CommentWrite';
import CommentLayout from './CommentLayout';
import { CommentProps } from 'service/api/comment/type';

import CommentSkeleton from './Skeleton';

const CommentBox = ({ pid }: { pid: string }) => {
  const {
    data: commentListData,
    refetch,
    isLoading,
  } = useGetCommentList(parseInt(pid));
  const queryClient = useQueryClient();

  const forceRefresh = React.useCallback(async () => {
    await queryClient.invalidateQueries({
      predicate: query => query.queryKey[0] === 'commentList',
    });
    await refetch();
  }, [queryClient, refetch]);

  React.useEffect(() => {
    // @ts-ignore
    window.refetchComments = forceRefresh;
    return () => {
      // @ts-ignore
      delete window.refetchComments;
    };
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
    <section className="w-full rounded-2xl border border-slate-100 bg-white shadow-sm px-6 py-5">
      <div className="mb-4 text-sm font-semibold text-ftBlack">
        {isLoading ? (
          <div className="w-20 h-4 bg-gray-100 rounded animate-pulse" />
        ) : (
          `댓글 ${commentListData ? commentListData.length : 0}개`
        )}
      </div>
      <article>
        {isLoading
          ? [1, 2, 3].map(i => (
              <CommentLayout key={i}>
                <CommentSkeleton />
              </CommentLayout>
            ))
          : sortedComments.map(
              (comment: React.JSX.IntrinsicAttributes & CommentProps) => (
                <CommentLayout key={comment.id}>
                  <CommentItem {...comment} refetch={forceRefresh} />
                </CommentLayout>
              ),
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
