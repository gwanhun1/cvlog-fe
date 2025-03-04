import Cookie from 'public/utils/Cookie';
import LocalStorage from 'public/utils/Localstorage';
import { UserInfo } from 'service/atoms/type';
import { apiInstance } from '../axiosInstance';
import { GetNewTokenApi, SignOut } from './type';

export const handleGetErrors = async (error: ErrorResponse) => {
  const accessToken = LocalStorage.getItem('CVtoken') as string;
  const refreshToken = Cookie.getItem('refreshToken') as string;
  const refreshParams = {
    headers: {
      refreshToken: refreshToken,
      Authorization: `Bearer ${accessToken}`,
    },
  };
  if (error.response && error.response.status === 401) {
    const newToken = await postRefreshToken(refreshParams);
    await LocalStorage.setItem('CVtoken', newToken.data.accessToken);
    await window.location.reload();
  }
};

export const handleMutateErrors = async (
  error: ErrorResponse
): Promise<void> => {
  const accessToken = LocalStorage.getItem('CVtoken') as string;
  const refreshToken = Cookie.getItem('refreshToken') as string;
  const refreshParams = {
    headers: {
      refreshToken: refreshToken,
      Authorization: `Bearer ${accessToken}`,
    },
  };
  if (error.response?.status === 401) {
    await alert('다시 시도해주세요.');
    const newToken = await postRefreshToken(refreshParams);
    await LocalStorage.setItem('CVtoken', newToken.data.accessToken);
  }
};

export const postRefreshToken = async (params: GetNewTokenApi) => {
  const { data } = await apiInstance.post('/auth/refresh', {}, params);
  return data;
};

export const getUserInfo = async () => {
  const { data } = await apiInstance.get<UserInfo>('/users/info');

  return data.data;
};

export const signOut = async () => {
  const { data } = await apiInstance.get<SignOut>('/auth/logout');

  return data.data;
};

export const login = async (params: LoginType): Promise<LoginResponse> => {
  try {
    const { data } = await apiInstance.post('/auth/login', params);
    return data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const { data } = await apiInstance.post('/auth/logout');
    return data;
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};

export const checkLogin = async () => {
  try {
    const { data } = await apiInstance.get('/auth/check');
    return data;
  } catch (error) {
    console.error('Error checking login status:', error);
    throw error;
  }
};

export interface ErrorResponse {
  response: {
    status: number;
  };
}
