import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
  return useMutation({
    mutationFn: (params: NewPostComment) => postNewComment(params),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'commentList',
      });
    },
    onError: (error: ErrorResponse) => {
      handleMutateErrors(error);
    },
  });
};

export const useModifyComment = (params: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => modifyComment(params, content),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'commentList',
      });
    },
    onError: (error: ErrorResponse) => {
      handleMutateErrors(error);
    },
  });
};

export const useDeleteComment = (params: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteComment(params),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'commentList',
      });
    },
    onError: (error: ErrorResponse) => {
      handleMutateErrors(error);
    },
  });
};

export const useGetCommentList = (params: number) => {
  return useQuery({
    queryKey: ['commentList', params],
    queryFn: () => getCommentList(params),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    // onError is removed in v5, use throwOnError or global cache callback if strictly needed,
    // but handleGetErrors usually does token refresh which might be better in axios interceptor or global query cache onError.
    // For now I won't pass onError directly to useQuery as it's deprecated/removed.
    // If handleGetErrors is needed, it should be in queryCache global config or inside queryFn wrapper.
    // Given the project structure, I will omit it here or use meta.
    enabled: !isNaN(params),
    throwOnError: false, 
  });
};
