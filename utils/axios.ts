import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import Cookie from 'public/utils/Cookie';
import LocalStorage from 'public/utils/Localstorage';

const API_URL: string =
  process.env.NODE_ENV === 'production'
    ? 'https://port-0-cvlog-be-m708xf650a274e01.sel4.cloudtype.app'
    : process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

let isRefreshing = false;
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
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'max-age=300',
  },
  // 응답 압축
  decompress: true,
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // SSR 환경 체크
    if (typeof window !== 'undefined') {
      const token = LocalStorage.getItem('LogmeToken');
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
  (response: AxiosResponse) => {
    if (response.headers['cache-control']) {
      const cache = response.headers['cache-control'];
      response.headers['cache-control'] = `${cache}, max-age=300`;
    }
    return response;
  },
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
        const accessToken = LocalStorage.getItem('LogmeToken');

        if (!refreshToken || !accessToken) {
          isRefreshing = false;
          if (typeof window !== 'undefined') {
            Cookie.removeItem('refreshToken');
            LocalStorage.removeItem('LogmeToken');

            if (!window.location.pathname.includes('/login')) {
              window.location.href = '/login';
            }
          }
          return Promise.reject(error);
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
          LocalStorage.setItem('LogmeToken', newAccessToken);
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
          LocalStorage.removeItem('LogmeToken');
          Cookie.removeItem('refreshToken');
          // 로그인 페이지로 리다이렉트 (alert 대신)
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }

        return Promise.reject(refreshError);
      }
    }

    // 재시도 로직 추가
    const config = error.config as CustomAxiosRequestConfig;

    // 재시도 횟수 초기화
    if (config._retryCount === undefined) {
      config._retryCount = 0;
    }

    // 최대 2번까지 재시도
    if (
      config._retryCount < 2 &&
      (error.response?.status === 500 || error.code === 'ECONNABORTED')
    ) {
      config._retryCount += 1;

      // 재시도 전 1초 대기
      await new Promise(resolve => setTimeout(resolve, 1000));

      return axiosInstance(config);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
