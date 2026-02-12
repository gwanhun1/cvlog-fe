import axiosInstance from 'utils/axios';
import {
  GetTagsFolderRes,
  CreateTagsFolderReq,
  CreateTagsFolderRes,
  PutTagsFolderRes,
  UpdateForm,
  GetListType,
} from './type';

export const getList = async (
  page: number,
  userId?: number,
  keyword?: string,
) => {
  let url = userId
    ? `/posts/page/${page}?userId=${userId}`
    : `/posts/page/${page}`;

  if (keyword) {
    url += userId ? `&keyword=${keyword}` : `?keyword=${keyword}`;
  }

  const { data } = await axiosInstance.get<GetListType>(url);

  return data.data;
};

export const getPublicList = async (page: number, keyword?: string) => {
  try {
    const url = keyword
      ? `/posts/public/page/${page}?keyword=${keyword}`
      : `/posts/public/page/${page}`;
    const { data } = await axiosInstance.get<GetListType>(url);
    return data.data;
  } catch (error) {
    console.error('Network Error in getPublicList:', error);
    return { posts: [], maxPage: 1 };
  }
};

export const fetchGetTagsFolders = async () => {
  const { data } = await axiosInstance.get<GetTagsFolderRes>('/tag_folders');
  return data.data;
};

export const fetchCreateTagsFolders = async (
  params: CreateTagsFolderReq,
): Promise<CreateTagsFolderRes> => {
  const { data } = await axiosInstance.post<CreateTagsFolderRes>(
    '/tag_folders',
    params,
  );
  return data;
};

export const fetchRemoveTagsFolders = async (params: number) => {
  const { data } = await axiosInstance.delete(`/tag_folders/${params}`);
  return data;
};

export const putTagsFolders = async (params: UpdateForm) => {
  const tagId = Number(params.tag_id);
  const folderId = Number(params.folder_id);

  if (isNaN(tagId) || isNaN(folderId)) {
    console.error('Invalid parameters for tag update:', params);
    throw new Error('Invalid tag_id or folder_id');
  }

  try {
    const { data } = await axiosInstance.put<PutTagsFolderRes>(
      `/tags/${tagId}/${folderId}`,
    );
    return data;
  } catch (error) {
    console.error('Error updating tag folder:', error);
    throw error;
  }
};

export const tagsAPI = {
  getAll: async () => {
    try {
      const { data } = await axiosInstance.get('/tags');
      return data;
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
  },
};
