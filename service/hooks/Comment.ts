import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  deleteComment,
  getCommentList,
  modifyComment,
  postNewComment,
} from 'service/api/comment';
import { NewPostComment } from 'service/api/comment/type';
import { handleGetErrors, handleMutateErrors } from 'service/api/login';
import { ErrorResponse } from 'service/api/login/type';

export const usePostNewComment = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (params: NewPostComment) => {
      return postNewComment(params);
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries();
      },
      onError: (error: ErrorResponse) => {
        handleMutateErrors(error);
      },
    }
  );
};

export const useModifyComment = (params: number) => {
  const queryClient = useQueryClient();
  return useMutation(
    (content: string) => {
      return modifyComment(params, content);
    },
    {
      onSuccess: () => {
        alert('수정되었습니다.');
        return queryClient.invalidateQueries(['commentList']);
      },
      onError: (error: ErrorResponse) => {
        handleMutateErrors(error);
      },
    }
  );
};

export const useDeleteComment = (params: number) => {
  const queryClient = useQueryClient();
  return useMutation(
    () => {
      return deleteComment(params);
    },
    {
      onSuccess: () => {
        alert('삭제되었습니다.');
        return queryClient.invalidateQueries(['commentList']);
      },
      onError: (error: ErrorResponse) => {
        handleMutateErrors(error);
      },
    }
  );
};

export const useGetCommentList = (params: number) => {
  return useQuery({
    queryKey: ['commentList'],
    queryFn: () => {
      return getCommentList(params);
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    onError: handleGetErrors,
  });
};
