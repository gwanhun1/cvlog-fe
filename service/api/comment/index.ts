import { axiosInstance } from 'service/axios';
import { CommentType, NewPostComment } from './type';

export const postNewComment = async (params: NewPostComment) => {
  const { data } = await axiosInstance.post('/comments', {
    post_id: params.post_id,
    content: params.content,
  });
  return data;
};

export const modifyComment = async (params: number) => {
  const { data } = await axiosInstance.put(`/comments/${params}`);
  return data;
};

export const deleteComment = async (params: number) => {
  const { data } = await axiosInstance.delete(`/comments/${params}`);
  return data;
};

export const getCommentList = async (params: number) => {
  const { data } = await axiosInstance.get(`/comments/${params}`);

  return data;
};
