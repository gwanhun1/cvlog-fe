import { useQuery } from '@tanstack/react-query';
import { getPublicProfile } from 'service/api/profile';
export const usePublicProfile = (username: string, page: number) => useQuery({ queryKey: ['publicProfile', username, page], queryFn: () => getPublicProfile(username, page), enabled: !!username, retry: 1 });
