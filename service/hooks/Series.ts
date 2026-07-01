import { useQuery } from '@tanstack/react-query';
import { getSeriesPosts } from 'service/api/series';

export const useSeriesPosts = (name?: string | null) => {
  return useQuery({
    queryKey: ['series', name],
    queryFn: () => getSeriesPosts(name as string),
    enabled: !!name && name.trim().length > 0,
    retry: 0,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
};
