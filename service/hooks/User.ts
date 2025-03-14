import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getUserInfo, handleGetErrors } from 'service/api/login';
import { updateUserDescription } from 'service/api/user';

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

export const useGetUserInfo = (
  params: number,
  onSuccess?: (data: any) => void
) => {
  return useQuery({
    queryKey: ['userInfo', params],
    queryFn: () => {
      return getUserInfo();
    },
    retry: 0,
    onError: handleGetErrors,
    onSuccess: onSuccess ? data => onSuccess(data) : undefined,
  });
};
