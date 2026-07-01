import { useQuery } from '@tanstack/react-query';
import { getPopularPosts } from 'service/api/popular';

export const usePopularPosts = (limit = 5) => {
  return useQuery({
    queryKey: ['popular', limit],
    queryFn: () => getPopularPosts(limit),
    retry: 0,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
};
