import { Content } from 'pages/article/content/[pid]';
import { axiosInstance as axios } from 'service/axios';
import { DeleteDetail, PatchDetailType } from './type';
import { CreateNewPostReq } from '../new/type';

export const getDetail = async (params: number) => {
  const { data } = await axios.get<Content>(`/posts/${params}`);
  return data.data;
};

export const getMyDetail = async (params: number) => {
  const { data } = await axios.get<Content>(`/posts/${params}/my`);
  return data.data;
};

export const deleteDetail = async (params: number) => {
  const { data } = await axios.delete<DeleteDetail>(`/posts/${params}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return data;
};

export const patchDetail = async (params: number, public_status: boolean) => {
  const { data } = await axios.patch<PatchDetailType>(`/posts/${params}`, {
    public_status,
  });
  return data;
};

export const fetchCreateModifyPost = async (
  params: CreateNewPostReq,
  pid: number
) => {
  const { data } = await axios.put<CreateNewPostReq>(`/posts/${pid}`, params);
  return data;
};
