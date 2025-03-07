import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import { fetchCreateNewPost } from 'service/api/detail';
import { CreateNewPostReq } from 'service/api/detail/type';
import { handleMutateErrors } from 'service/api/login';
import { ErrorResponse } from 'service/api/login/type';

export const useCreatePost = () => {
  const router = useRouter();
  return useMutation<CreateNewPostReq, ErrorResponse, CreateNewPostReq>(
    (params: CreateNewPostReq) => {
      return fetchCreateNewPost(params);
    },
    {
      onSuccess: () => {
        alert('성공적으로 저장되었습니다.');
        router.push('/article');
      },
      onError: (error: ErrorResponse) => {
        handleMutateErrors(error);
      },
    }
  );
};
