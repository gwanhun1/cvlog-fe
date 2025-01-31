import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// For development fallback
export const axiosMock = async (mockType: string) => {
  const axiosMockBase = axios.create({
    baseURL: `/mockData/${mockType}MockData.json`,
  });

  const response = await axiosMockBase.get('');
  return response.data;
};
