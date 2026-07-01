import axiosInstance from 'utils/axios';
import { GetPopularRes } from './type';

export const getPopularPosts = async (limit = 5) => {
  const { data } = await axiosInstance.get<GetPopularRes>(
    `/posts/popular?limit=${limit}`,
  );
  return data.data;
};
