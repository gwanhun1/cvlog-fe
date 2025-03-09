import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const deleteAccount = async (): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/users/delete`, {
      withCredentials: true,
    });
    return;
  } catch (error) {
    console.error('회원 탈퇴 중 오류가 발생했습니다:', error);
    throw error;
  }
};
