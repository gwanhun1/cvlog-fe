import { axiosInstance } from 'utils/axios';
import type { PublicProfile } from './type';
export const getPublicProfile = async (username: string, page = 1): Promise<PublicProfile> => {
  const { data } = await axiosInstance.get(`/users/public/${encodeURIComponent(username)}`, { params: { page } });
  return data.data;
};
