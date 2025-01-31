import axios from 'axios';
import LocalStorage from 'public/utils/Localstorage';

const config = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
};

const instance = axios.create(config);

// 요청 인터셉터 추가
instance.interceptors.request.use(
  (config) => {
    const token = LocalStorage.getItem('CVtoken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
