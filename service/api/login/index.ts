import Cookie from 'public/utils/Cookie';
import LocalStorage from 'public/utils/Localstorage';
import { axiosInstance as axios } from 'utils/axios';
import { ErrorResponse, GetNewTokenApi, SignOut, UserInfo } from './type';

export const handleGetErrors = async (error: ErrorResponse) => {
  const accessToken = LocalStorage.getItem('LogmeToken') as string;
  const refreshToken = Cookie.getItem('refreshToken') as string;
  const refreshParams = {
    headers: {
      refreshToken: refreshToken,
      Authorization: `Bearer ${accessToken}`,
    },
  };
  if (error.response && error.response.status === 401) {
    try {
      const newToken = await postRefreshToken(refreshParams);
      await LocalStorage.setItem('LogmeToken', newToken.data.accessToken);
      return newToken;
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError);
      return Promise.reject(refreshError);
    }
  }
  return Promise.reject(error);
};

export const handleMutateErrors = async (
  error: ErrorResponse
): Promise<void> => {
  const accessToken = LocalStorage.getItem('LogmeToken') as string;
  const refreshToken = Cookie.getItem('refreshToken') as string;
  const refreshParams = {
    headers: {
      refreshToken: refreshToken,
      Authorization: `Bearer ${accessToken}`,
    },
  };
  if (error.response?.status === 401) {
    try {
      const newToken = await postRefreshToken(refreshParams);
      await LocalStorage.setItem('LogmeToken', newToken.data.accessToken);
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError);
      await alert('인증이 만료되었습니다. 다시 로그인해주세요.');
    }
  }
};

export const postRefreshToken = async (params: GetNewTokenApi) => {
  try {
    const { data } = await axios.post('/auth/refresh', {}, params);
    return data;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};

export const getUserInfo = async () => {
  const { data } = await axios.get<UserInfo>('/users/info');

  return data.data;
};

export const signOut = async () => {
  const { data } = await axios.get<SignOut>('/auth/logout');

  return data.data;
};
