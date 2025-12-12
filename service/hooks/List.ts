import { useMutation, useQuery, useQueryClient } from 'react-query';
import { handleGetErrors, handleMutateErrors } from 'service/api/login';
import { ErrorResponse } from 'service/api/login/type';
import {
  fetchCreateTagsFolders,
  fetchGetTagsFolders,
  fetchRemoveTagsFolders,
  getList,
  getPublicList,
  putTagsFolders,
} from 'service/api/tag';
import {
  CreateTagsFolderReq,
  CreateTagsFolderRes,
  UpdateForm,
  PutTagsFolderRes,
  Folder,
} from 'service/api/tag/type';

export const useGetList = (page: number, userId?: number) => {
  return useQuery({
    queryKey: ['list', page, userId],
    queryFn: () => {
      return getList(page, userId);
    },
    onError: handleGetErrors,
    retry: 0,
  });
};

export const useGetPublicList = (page: number) => {
  return useQuery({
    queryKey: ['publicList', page],
    queryFn: () => getPublicList(page),
    onError: handleGetErrors,
    retry: 0,
  });
};

export const useGetFolders = () => {
  return useQuery({
    queryKey: ['tagsFolder'],
    queryFn: () => {
      return fetchGetTagsFolders();
    },
    onError: handleGetErrors,
    retry: 0,
  });
};

export const useCreateFolders = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateTagsFolderRes, ErrorResponse, CreateTagsFolderReq>(
    (params: CreateTagsFolderReq) => {
      return fetchCreateTagsFolders(params);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tagsFolder']);
      },
      onError: (error: ErrorResponse) => {
        handleMutateErrors(error);
      },
    }
  );
};

export const useRemoveFolders = (params: number) => {
  const queryClient = useQueryClient();
  return useMutation(
    () => {
      return fetchRemoveTagsFolders(params);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tagsFolder']);
      },
      onError: (error: ErrorResponse) => {
        handleMutateErrors(error);
      },
    }
  );
};

export const usePutTagsFolder = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (params: UpdateForm) => {
      return putTagsFolders(params);
    },
    {
      onError: (error: ErrorResponse) => {
        handleMutateErrors(error);
        queryClient.invalidateQueries(['tagsFolder']);
      },
    }
  );
};
