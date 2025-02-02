import {
  GetListType,
  GetTagsListType,
  GetTagsType,
  PostTagsFolderReq,
  PostTagsFolderRes,
  PutTagsFolderRes,
  UpdateForm,
} from './type';
import { axiosInstance as axios } from 'service/axios';

export const getList = async (page: number, userId?: number) => {
  const url = userId
    ? `/posts/page/${page}?userId=${userId}`
    : `/posts/page/${page}`;
  const { data } = await axios.get<GetListType>(url);

  return data.data;
};

export const getPublicList = async (page: number) => {
  const { data } = await axios.get<GetListType>(`/posts/public/page/${page}`);
  return data.data;
};

export const fetchGetTagsFolders = async () => {
  const { data } = await axios.get<GetTagsFolderRes>('/tag_folders');

  return data.data;
};

export const fetchCreateTagsFolders = async (
  params: PostTagsFolderReq
): Promise<PostTagsFolderRes> => {
  const { data } = await axios.post<PostTagsFolderRes>('/tag_folders', params);
  return data;
};

export const fetchRemoveTagsFolders = async (params: number) => {
  const { data } = await axios.delete<RemoveTagsFolderRes>(
    `/tag_folders/${params}`
  );
  return data;
};

export const putTagsFolders = async (params: UpdateForm) => {
  const { data } = await axios.put<PutTagsFolderRes>(
    `/tags/${params.tag_id}/${params.folder_id}`
  );
  return data;
};
