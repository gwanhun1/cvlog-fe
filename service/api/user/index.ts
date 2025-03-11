import { axiosInstance } from 'utils/axios';

export const deleteAccount = async (): Promise<void> => {
  try {
    await axiosInstance.delete('/users/delete');
    return;
  } catch (error) {
    console.error('회원 탈퇴 중 오류가 발생했습니다:', error);
    throw error;
  }
};

export const updateUserDescription = async (
  description: string
): Promise<void> => {
  try {
    await axiosInstance.put('/users/description', { description });
    return;
  } catch (error) {
    console.error('사용자 설명 업데이트 중 오류가 발생했습니다:', error);
    throw error;
  }
};
