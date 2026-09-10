import { axiosInstance } from 'utils/axios';
export interface DiscoveryFilters { tags: { name: string; count: string }[]; series: { name: string; count: string }[] }
export const getDiscoveryFilters = async (): Promise<DiscoveryFilters> => (await axiosInstance.get('/posts/public/filters')).data.data;
