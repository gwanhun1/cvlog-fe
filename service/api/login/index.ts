import Cookie from 'public/utils/Cookie';
import LocalStorage from 'public/utils/Localstorage';
import axios, { AxiosError, isAxiosError } from 'axios';
import { axiosInstance } from 'utils/axios';
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
      // 로그인 페이지로 리다이렉트 (alert 대신)
      if (
        typeof window !== 'undefined' &&
        !window.location.pathname.includes('/login')
      ) {
        window.location.href = '/login';
      }
    }
  }
};

export const postRefreshToken = async (params: GetNewTokenApi) => {
  try {
    const refreshToken = params.headers.refreshToken;
    const accessToken = params.headers.Authorization?.replace('Bearer ', '');

    if (
      !refreshToken ||
      refreshToken === 'undefined' ||
      refreshToken === 'null' ||
      !accessToken ||
      accessToken === 'undefined' ||
      accessToken === ''
    ) {
      console.warn('Missing or invalid tokens for refresh request');
      if (typeof window !== 'undefined') {
        Cookie.removeItem('refreshToken');
        LocalStorage.removeItem('LogmeToken');
      }
      return { success: false, data: { accessToken: '' } };
    }

    const { data } = await axiosInstance.post('/auth/refresh', {}, params);
    return data;
  } catch (error) {
    console.error('Error refreshing token:', error);

    if (isAxiosError(error) && error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        Cookie.removeItem('refreshToken');
        LocalStorage.removeItem('LogmeToken');
      }
      return { success: false, data: { accessToken: '' } };
    }

    throw error;
  }
};

export const getUserInfo = async () => {
  try {
    const token =
      typeof window !== 'undefined' ? LocalStorage.getItem('LogmeToken') : null;

    if (!token) {
      console.warn('No token available for getUserInfo request');
      return null;
    }

    const { data } = await axiosInstance.get<UserInfo>('/users/info', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data.data;
  } catch (error: unknown) {
    console.error('Error fetching user info:', error);

    if (isAxiosError(error) && error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        LocalStorage.removeItem('LogmeToken');
        Cookie.removeItem('refreshToken');
      }
    }

    return null;
  }
};

export const signOut = async () => {
  const { data } = await axiosInstance.get<SignOut>('/auth/logout');

  return data.data;
};

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
