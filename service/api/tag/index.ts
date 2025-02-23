import { axiosInstance } from 'service/axios';
import {
  GetTagsFolderRes,
  CreateTagsFolderReq,
  CreateTagsFolderRes,
  PutTagsFolderRes,
  UpdateForm,
} from './type';
import { GetListType } from 'components/pages/article/listView/ListView';

export const getList = async (page: number, userId?: number) => {
  const url = userId
    ? `/posts/page/${page}?userId=${userId}`
    : `/posts/page/${page}`;
  const { data } = await axiosInstance.get<GetListType>(url);

  return data.data;
};

export const getPublicList = async (page: number) => {
  const { data } = await axiosInstance.get<GetListType>(`/posts/public/page/${page}`);
  return data.data;
};

export const fetchGetTagsFolders = async () => {
  const { data } = await axiosInstance.get<GetTagsFolderRes>('/tag_folders');

  return data.data;
};

export const fetchCreateTagsFolders = async (
  params: CreateTagsFolderReq
): Promise<CreateTagsFolderRes> => {
  const { data } = await axiosInstance.post<CreateTagsFolderRes>(
    '/tag_folders',
    params
  );
  return data;
};

export const fetchRemoveTagsFolders = async (params: number) => {
  const { data } = await axiosInstance.delete(`/tag_folders/${params}`);
  return data;
};

export const putTagsFolders = async (params: UpdateForm) => {
  const { data } = await axiosInstance.put<PutTagsFolderRes>(
    `/tags/${params.tag_id}/${params.folder_id}`
  );
  return data;
};

export const tagsAPI = {
  getAll: async () => {
    const response = await axiosInstance.get('/tags');
    return response.data;
  },

  getWithoutFolder: async () => {
    const response = await axiosInstance.get('/tags/without-folder');
    return response.data;
  },
};
