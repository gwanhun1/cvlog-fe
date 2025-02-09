import { useRouter } from 'next/router';
import { useMutation, useQuery } from 'react-query';
import {
  deleteDetail,
  fetchCreateModifyPost,
  getDetail,
  getMyDetail,
  patchDetail,
} from 'service/api/detail';
import {
  ErrorResponse,
  handleGetErrors,
  handleMutateErrors,
} from 'service/api/login';
import { CreateNewPostReq } from 'service/api/new/type';

export const useGetDetail = (params: number) => {
  return useQuery({
    queryKey: ['detail', params],
    queryFn: () => {
      return getDetail(params);
    },
    retry: 0,
    onError: handleGetErrors,
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
  });
};

export const DeleteDetail = (params: number) => {
  return useMutation(
    () => {
      console.log(33);

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
  return useMutation<CreateNewPostReq, ErrorResponse, CreateNewPostReq>(
    (params: CreateNewPostReq) => {
      return fetchCreateModifyPost(params, pid);
    },
    {
      onSuccess: async () => {
        await alert('성공적으로 저장되었습니다.');
        await router.push('/article');
      },
      retry: 0,
      onError: (error: ErrorResponse) => {
        handleMutateErrors(error);
      },
    }
  );
};
