import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLikedPosts, toggleLike } from 'service/api/like';
import { ContentData } from 'service/api/detail/type';

interface DetailQueryData {
  post: ContentData;
  prevPostInfo: { id: number; title: string } | null;
  nextPostInfo: { id: number; title: string } | null;
}

export const useToggleLike = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => toggleLike(postId),
    onMutate: async () => {
      // 진행 중인 refetch 취소
      await queryClient.cancelQueries({ queryKey: ['detail', postId] });

      // 이전 캐시 스냅샷
      const previousDetail = queryClient.getQueryData<DetailQueryData>(['detail', postId]);

      // 낙관적 업데이트: detail 캐시
      if (previousDetail?.post) {
        const wasLiked = previousDetail.post.is_liked;
        queryClient.setQueryData<DetailQueryData>(['detail', postId], {
          ...previousDetail,
          post: {
            ...previousDetail.post,
            is_liked: !wasLiked,
            like_count: wasLiked
              ? previousDetail.post.like_count - 1
              : previousDetail.post.like_count + 1,
          },
        });
      }

      return { previousDetail };
    },
    onError: (_err, _vars, context) => {
      // 롤백
      if (context?.previousDetail) {
        queryClient.setQueryData(['detail', postId], context.previousDetail);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['detail', postId] });
      queryClient.invalidateQueries({ queryKey: ['likedPosts'] });
    },
  });
};

export const useGetLikedPosts = () => {
  return useInfiniteQuery({
    queryKey: ['likedPosts'],
    queryFn: ({ pageParam = 1 }) => getLikedPosts(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.maxPage ? nextPage : undefined;
    },
    retry: 0,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
  });
};
