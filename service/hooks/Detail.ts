import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteDetail,
  fetchCreateModifyPost,
  getDetail,
  getLikePost,
  getMyDetail,
  patchDetail,
} from 'service/api/detail';
import { CreateNewPostReq } from 'service/api/detail/type';
import { handleGetErrors, handleMutateErrors } from 'service/api/login';
import { ErrorResponse } from 'service/api/login/type';

export const useGetDetail = (params: number, initialData?: any) => {
  return useQuery({
    queryKey: ['detail', params],
    queryFn: () => getDetail(params),
    retry: 0,
    enabled: !isNaN(params),
    initialData,
    // useErrorBoundary is renamed to throwOnError
    throwOnError: false,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
  });
};

export const useGetMyDetail = (params: number) => {
  return useQuery({
    queryKey: ['getMyDetail', params],
    queryFn: () => getMyDetail(params),
    retry: 0,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
  });
};

export const useDeleteDetail = (params: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteDetail(params),
    retry: 0,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tagsFolder'] });
    },
    onError: (error: ErrorResponse) => {
      handleMutateErrors(error);
    },
  });
};

export const usePatchDetail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      public_status,
    }: {
      id: number;
      public_status: boolean;
    }) => patchDetail(id, public_status),
    retry: 0,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tagsFolder'] });
    },
    onError: (error: ErrorResponse) => {
      handleMutateErrors(error);
    },
  });
};

export const useModifyPost = (pid: number) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: CreateNewPostReq) =>
      fetchCreateModifyPost(params, pid),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['list'] }),
        queryClient.invalidateQueries({ queryKey: ['publicList'] }),
        queryClient.invalidateQueries({ queryKey: ['detail', pid] }),
        queryClient.invalidateQueries({ queryKey: ['tagsFolder'] }),
      ]);
      await router.push('/article');
    },
    retry: 0,
    onError: (error: ErrorResponse) => {
      handleMutateErrors(error);
    },
  });
};

export const useGetLikePost = (params: number) => {
  return useQuery({
    queryKey: ['getLikePost', params],
    queryFn: () => getLikePost(params),
    retry: 0,
    enabled: !!params,
  });
};

export const usePostLike = ({ options }: any) => {
  return useMutation({
    mutationFn: ({
      id,
      public_status,
    }: {
      id: number;
      public_status: boolean;
    }) => patchDetail(id, public_status),
    ...options,
    onError: (error: ErrorResponse) => {
      handleMutateErrors(error);
      if (options?.onError) options.onError(error);
    },
  });
};
