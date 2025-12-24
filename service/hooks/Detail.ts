import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
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

export const useGetDetail = (
  params: number,
  onSuccess?: (data: any) => void,
  initialData?: any
) => {
  return useQuery({
    queryKey: ['detail', params],
    queryFn: () => {
      return getDetail(params);
    },
    retry: 0,
    onError: handleGetErrors,
    onSuccess: onSuccess ? data => onSuccess(data) : undefined,
    enabled: !isNaN(params),
    initialData,
    useErrorBoundary: false,
    // 성능 최적화: 2분간 캐시 유지
    staleTime: 1000 * 60 * 2,
    cacheTime: 1000 * 60 * 10,
  });
};

export const useGetMyDetail = (params: number) => {
  return useQuery({
    queryKey: ['getMyDetail', params],
    queryFn: () => {
      return getMyDetail(params);
    },
    retry: 0,
    onError: handleGetErrors,
    staleTime: 1000 * 60 * 2,
    cacheTime: 1000 * 60 * 10,
  });
};

export const DeleteDetail = (params: number) => {
  return useMutation(
    () => {
      return deleteDetail(params);
    },
    {
      retry: 0,
      onError: (error: ErrorResponse) => {
        handleMutateErrors(error);
      },
    }
  );
};

export const usePatchDetail = () => {
  return useMutation(
    ({ id, public_status }: { id: number; public_status: boolean }) =>
      patchDetail(id, public_status),
    {
      retry: 0,
      onError: (error: ErrorResponse) => {
        handleMutateErrors(error);
      },
    }
  );
};

export const useModifyPost = (pid: number) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation<CreateNewPostReq, ErrorResponse, CreateNewPostReq>(
    (params: CreateNewPostReq) => {
      return fetchCreateModifyPost(params, pid);
    },
    {
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['list'] }),
          queryClient.invalidateQueries({ queryKey: ['publicList'] }),
          queryClient.invalidateQueries({ queryKey: ['detail', pid] }),
        ]);
        await router.push('/article');
      },
      retry: 0,
      onError: (error: ErrorResponse) => {
        handleMutateErrors(error);
      },
    }
  );
};

export const useGetLikePost = (params: number) => {
  return useQuery({
    queryKey: ['getLikePost', params],
    queryFn: () => {
      return getLikePost(params);
    },
    retry: 0,
    onError: handleGetErrors,
    enabled: !!params,
  });
};

export const usePostLike = ({ options }: any) => {
  return useMutation(
    ({ id, public_status }: { id: number; public_status: boolean }) =>
      patchDetail(id, public_status),
    {
      ...options,
      onError: (error: ErrorResponse) => {
        handleMutateErrors(error);
      },
    }
  );
};
