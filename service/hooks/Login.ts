import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getUserInfo,
  handleGetErrors,
  postRefreshToken,
  updateUserDescription,
} from 'service/api/login';
import { GetNewTokenApi } from 'service/api/login/type';

export const useRefreshToken = (params: GetNewTokenApi) => {
  return useMutation({
    mutationFn: () => postRefreshToken(params)
  });
};

export const useUpdateUserDescription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (description: string) => updateUserDescription(description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userInfo'] });
    },
  });
};

export const useGetUserInfo = () => {
  return useQuery({
    queryKey: ['userInfo'],
    queryFn: () => getUserInfo(),
    retry: 0,
    // Note: handleGetErrors should probably be handled where the query is used or in global meta
    // staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
};
