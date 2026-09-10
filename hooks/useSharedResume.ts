import { useQuery } from '@tanstack/react-query';
import { getSharedResume } from 'service/api/resume';
export const useSharedResume = (token: string) => useQuery({ queryKey: ['sharedResume', token], queryFn: () => getSharedResume(token), enabled: /^[a-f0-9]{64}$/.test(token), retry: false, staleTime: 0, gcTime: 0 });
