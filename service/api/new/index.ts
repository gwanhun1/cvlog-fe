import { CreateNewPostReq } from './type';
import { axiosInstance as axios } from 'service/axios';

export const fetchCreateNewPost = async (params: CreateNewPostReq) => {
  const { data } = await axios.post<CreateNewPostReq>('/posts', params);

  return data;
};
