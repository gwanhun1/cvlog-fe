import { axiosInstance as axios } from 'service/axios';
import { CreateNewPostReq } from './type';

export const fetchCreateNewPost = async (params: CreateNewPostReq) => {
  const { data } = await axios.post<CreateNewPostReq>('/posts', params);

  return data;
};
