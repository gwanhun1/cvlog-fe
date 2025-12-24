import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from 'react-query';
import { fetchCreateNewPost } from 'service/api/detail';
import { CreateNewPostReq } from 'service/api/detail/type';
import { handleMutateErrors } from 'service/api/login';
import { ErrorResponse } from 'service/api/login/type';

export const useCreatePost = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation<CreateNewPostReq, ErrorResponse, CreateNewPostReq>(
    (params: CreateNewPostReq) => {
      return fetchCreateNewPost(params);
    },
    {
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['list'] }),
          queryClient.invalidateQueries({ queryKey: ['publicList'] }),
        ]);
        await router.push('/article');
      },
      onError: (error: ErrorResponse) => {
        handleMutateErrors(error);
      },
    }
  );
};
