import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
} from 'service/api/tag/type';

export const useGetList = (
  page: number,
  userId?: number,
  enabled = true,
  initialData?: any
) => {
  return useQuery({
    queryKey: ['list', page, userId],
    queryFn: () => getList(page, userId),
    retry: 0,
    enabled,
    initialData,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
  });
};

export const useGetPublicList = (
  page: number,
  enabled = true,
  initialData?: any
) => {
  return useQuery({
    queryKey: ['publicList', page],
    queryFn: () => getPublicList(page),
    retry: 0,
    enabled,
    initialData,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
  });
};

export const useGetFolders = () => {
  return useQuery({
    queryKey: ['tagsFolder'],
    queryFn: () => fetchGetTagsFolders(),
    retry: 0,
  });
};

export const useCreateFolders = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: CreateTagsFolderReq) => fetchCreateTagsFolders(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tagsFolder'] });
    },
    onError: (error: ErrorResponse) => {
      handleMutateErrors(error);
    },
  });
};

export const useRemoveFolders = (params: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => fetchRemoveTagsFolders(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tagsFolder'] });
    },
    onError: (error: ErrorResponse) => {
      handleMutateErrors(error);
    },
  });
};

export const usePutTagsFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: UpdateForm) => putTagsFolders(params),
    onError: (error: ErrorResponse) => {
      handleMutateErrors(error);
      queryClient.invalidateQueries({ queryKey: ['tagsFolder'] });
    },
  });
};
