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
      await alert('인증이 만료되었습니다. 다시 로그인해주세요.');
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
