import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

interface LikeStatus {
  isLiked: boolean;
  isDisliked: boolean;
}

interface LikeResponse {
  isLiked: boolean;
  isDisliked: boolean;
}

type LikeType = 'like' | 'dislike';

export const useLike = (postId: number) => {
  const queryClient = useQueryClient();

  const {
    data: likeStatus,
    isLoading: isQueryLoading,
    isError,
  } = useQuery<LikeStatus>(
    ['likes', postId],
    async () => {
      if (!postId) {
        throw new Error('postId is required');
      }
      const response = await axios.get<LikeResponse>(`/likes/${postId}`);
      return response.data;
    },
    {
      enabled: !!postId,
    }
  );

  const { mutate: toggleLike, isLoading: isMutationLoading } = useMutation<
    LikeResponse,
    Error,
    LikeType
  >(
    type =>
      axios
        .post<LikeResponse>(`/likes/${postId}`, { type })
        .then(res => res.data),
    {
      onSuccess: data => {
        queryClient.setQueryData(['likes', postId], data);
      },
      onError: () => {
        toast.error('좋아요 처리 중 오류가 발생했습니다.');
      },
    }
  );

  const isLoading = isQueryLoading || isMutationLoading;

  return {
    isLiked: likeStatus?.isLiked ?? false,
    isDisliked: likeStatus?.isDisliked ?? false,
    toggleLike,
    isLoading,
    isError,
  };
};
