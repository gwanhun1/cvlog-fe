import { axiosInstance as axios } from 'utils/axios';
import { GetLikedPostsResponse, ToggleLikeResponse } from './type';

export const toggleLike = async (postId: number): Promise<ToggleLikeResponse> => {
  const { data } = await axios.post<{ success: boolean; data: ToggleLikeResponse }>(
    `/posts/${postId}/like`,
  );
  return data.data;
};

export const getLikedPosts = async (page: number): Promise<GetLikedPostsResponse> => {
  const { data } = await axios.get<{ success: boolean; data: GetLikedPostsResponse }>(
    `/likes/me`,
    { params: { page } },
  );
  return data.data;
};
