import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import Cookie from 'public/utils/Cookie';
import LocalStorage from 'public/utils/Localstorage';

const API_URL: string =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// 토큰 갱신 중인지 확인하는 플래그
let isRefreshing = false;

// 토큰 갱신 대기 중인 요청들을 저장하는 배열
let refreshSubscribers: Array<(token: string) => void> = [];

interface AuthResponse {
  data: {
    accessToken: string;
  };
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry401?: boolean;
  _retry429?: boolean;
  _retryCount?: number;
}

// 토큰 갱신 후 대기 중인 요청들을 처리하는 함수
const onRefreshed = (token: string): void => {
  refreshSubscribers.map(callback => callback(token));
  refreshSubscribers = [];
};

// 토큰 갱신을 기다리는 함수
const addRefreshSubscriber = (callback: (token: string) => void): void => {
  refreshSubscribers.push(callback);
};

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // SSR 환경 체크
    if (typeof window !== 'undefined') {
      const token = LocalStorage.getItem('CVtoken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<any> => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // 429 Too Many Requests 처리
    if (error.response?.status === 429 && !originalRequest._retry429) {
      originalRequest._retry429 = true;
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

      if (originalRequest._retryCount <= 3) {
        const backoffDelay: number =
          Math.pow(2, originalRequest._retryCount - 1) * 1000;
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        return axiosInstance(originalRequest);
      }
    }

    // 401 Unauthorized 처리
    if (error.response?.status === 401 && !originalRequest._retry401) {
      if (isRefreshing) {
        // 토큰 갱신 중이면 대기열에 추가
        return new Promise(resolve => {
          addRefreshSubscriber(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry401 = true;
      isRefreshing = true;

      try {
        const refreshToken = Cookie.getItem('refreshToken');
        const accessToken = LocalStorage.getItem('CVtoken');

        if (!refreshToken || !accessToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post<AuthResponse>(
          `${API_URL}/auth/refresh`,
          {},
          {
            headers: {
              refreshToken: refreshToken,
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const newAccessToken = response.data.data.accessToken;

        if (typeof window !== 'undefined') {
          LocalStorage.setItem('CVtoken', newAccessToken);
        }

        axiosInstance.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        isRefreshing = false;
        onRefreshed(newAccessToken);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;

        if (typeof window !== 'undefined') {
          LocalStorage.removeItem('CVtoken');
          Cookie.removeItem('refreshToken');
          alert('로그인이 필요합니다.');
          window.location.href = '/'; // 로그인 페이지로 리다이렉트
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// For development fallback
export const axiosMock = async (mockType: string): Promise<any> => {
  const axiosMockBase: AxiosInstance = axios.create({
    baseURL: `/mockData/${mockType}MockData.json`,
  });

  const response = await axiosMockBase.get('');
  return response.data;
};

export default axiosInstance;
