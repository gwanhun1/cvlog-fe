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
// axiosInstance.interceptors.response.use(
//   response => response,
//   async error => {
//     const originalRequest = error.config;

//     // 401 Unauthorized 에러이고 재시도하지 않은 요청인 경우
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         // refreshToken으로 새로운 accessToken 발급 요청
//         const refreshToken = Cookie.getItem('refreshToken');
//         const accessToken = LocalStorage.getItem('CVtoken');

//         const response = await axiosInstance.post(
//           '/auth/refresh',
//           {},
//           {
//             headers: {
//               refreshToken: refreshToken,
//               Authorization: `Bearer ${accessToken}`,
//             },
//           }
//         );

//         const newAccessToken = response.data.data.accessToken;

//         // 새로운 accessToken을 localStorage에 저장
//         LocalStorage.setItem('CVtoken', newAccessToken);

//         // 원래 요청의 헤더에 새로운 accessToken 설정
//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

//         // 원래 요청 재시도
//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         // refreshToken도 만료된 경우
//         if (typeof window !== 'undefined') {
//           LocalStorage.removeItem('CVtoken');
//           window.location.href = '/';
//         }
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// For development fallback
export const axiosMock = async (mockType: string) => {
  const axiosMockBase = axios.create({
    baseURL: `/mockData/${mockType}MockData.json`,
  });

  const response = await axiosMockBase.get('');
  return response.data;
};

export default axiosInstance;
