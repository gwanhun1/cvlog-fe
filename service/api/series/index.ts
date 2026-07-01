import axiosInstance from 'utils/axios';
import { GetSeriesRes } from './type';

export const getSeriesPosts = async (name: string) => {
  const { data } = await axiosInstance.get<GetSeriesRes>('/posts/series', {
    params: { name },
  });
  return data.data;
};
