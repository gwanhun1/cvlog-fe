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

  const { data: likeStatus } = useQuery<LikeStatus>(['likes', postId], async () => {
    const response = await axios.get<LikeResponse>(`/api/likes/${postId}`);
    return response.data;
  }, {
    enabled: !!postId,
  });

  const { mutate: toggleLike, isLoading } = useMutation<
    LikeResponse,
    Error,
    LikeType
  >((type) => 
    axios.post<LikeResponse>(`/api/likes/${postId}`, { type }).then((res) => res.data), {
    onSuccess: (data) => {
      queryClient.setQueryData(['likes', postId], data);
    },
    onError: () => {
      toast.error('좋아요 처리 중 오류가 발생했습니다.');
    },
  });

  return {
    isLiked: likeStatus?.isLiked ?? false,
    isDisliked: likeStatus?.isDisliked ?? false,
    toggleLike,
    isLoading,
  };
};
