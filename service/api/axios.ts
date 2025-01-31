import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 응답 인터셉터 추가
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // 401 Unauthorized 에러 처리
    if (error.response?.status === 401) {
      // 토큰 제거
      if (typeof window !== 'undefined') {
        localStorage.removeItem('CVtoken');
        window.location.href = '/';
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
