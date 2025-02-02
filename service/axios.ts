import axios from 'axios';
import LocalStorage from 'public/utils/Localstorage';
import Cookie from 'public/utils/Cookie';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 추가
axiosInstance.interceptors.request.use(
  config => {
    const token = LocalStorage.getItem('CVtoken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // 429 Too Many Requests 에러 처리
    if (error.response?.status === 429 && !originalRequest._retry429) {
      originalRequest._retry429 = true;
      
      // 재시도 횟수 초기화
      if (!originalRequest._retryCount) {
        originalRequest._retryCount = 0;
      }

      // 최대 3번까지 재시도
      if (originalRequest._retryCount < 3) {
        originalRequest._retryCount++;
        
        // 지수 백오프: 1초, 2초, 4초 후 재시도
        const backoffDelay = Math.pow(2, originalRequest._retryCount - 1) * 1000;
        
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        
        return axiosInstance(originalRequest);
      }
    }

    // 401 Unauthorized 에러 처리
    if (error.response?.status === 401 && !originalRequest._retry401) {
      originalRequest._retry401 = true;

      try {
        const refreshToken = Cookie.getItem('refreshToken');
        const accessToken = LocalStorage.getItem('CVtoken');

        const response = await axiosInstance.post(
          '/auth/refresh',
          {},
          {
            headers: {
              refreshToken: refreshToken,
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const newAccessToken = response.data.data.accessToken;
        LocalStorage.setItem('CVtoken', newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        if (typeof window !== 'undefined') {
          LocalStorage.removeItem('CVtoken');
          window.location.href = '/';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// For development fallback
export const axiosMock = async (mockType: string) => {
  const axiosMockBase = axios.create({
    baseURL: `/mockData/${mockType}MockData.json`,
  });

  const response = await axiosMockBase.get('');
  return response.data;
};

export default axiosInstance;
