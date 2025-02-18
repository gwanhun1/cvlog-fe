import React from 'react';
import { GetServerSideProps } from 'next';
import { useGetCommentList } from 'service/hooks/Comment';
import CommentItem from './Comment';
import CommentWrite from './CommentWrite';
import CommentLayout from './CommentLayout';

const CommentBox = ({ pid }: { pid: string }) => {
  const commentList = useGetCommentList(parseInt(pid));
  return (
    <section className="flex flex-col w-full p-1 tablet:mt-3 ">
      <h2 className="flex justify-start my-2 ml-1 text-xs mobile:text-base text-ftBlack">
        {commentList.data && commentList.data.data.length} 개의 댓글
      </h2>
      <article>
        {commentList.data &&
          commentList.data.data.map(comment => (
            <CommentLayout key={comment.id}>
              <CommentItem {...comment} />
            </CommentLayout>
          ))}
      </article>
      <CommentWrite pid={pid} />
    </section>
  );
};

export default CommentBox;

export const getServerSideProps: GetServerSideProps = async context => {
  const pid = context.params?.pid;
  return { props: { pid } };
};
