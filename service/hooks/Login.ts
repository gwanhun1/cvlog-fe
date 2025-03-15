import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  getUserInfo,
  handleGetErrors,
  postRefreshToken,
  updateUserDescription,
} from 'service/api/login';
import { GetNewTokenApi } from 'service/api/login/type';

export const useRefreshToken = (params: GetNewTokenApi) => {
  return useMutation(() => {
    return postRefreshToken(params);
  });
};

export const useUpdateUserDescription = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (description: string) => updateUserDescription(description),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['userInfo']);
      },
    }
  );
};

export const useGetUserInfo = (onSuccess?: (data: any) => void) => {
  return useQuery({
    queryKey: ['userInfo'],
    queryFn: () => {
      return getUserInfo();
    },
    retry: 0,
    onError: handleGetErrors,
    onSuccess: onSuccess ? data => onSuccess(data) : undefined,
  });
};
