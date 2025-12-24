import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getGithubSyncSettings,
  createGithubRepo,
  checkGithubRepoStatus,
  disconnectGithubSync,
} from 'service/api/github-sync';

// 동기화 설정 조회
export const useGithubSyncSettings = () => {
  return useQuery({
    queryKey: ['githubSyncSettings'],
    queryFn: getGithubSyncSettings,
    staleTime: 1000 * 60 * 5, // 5분
    retry: 1,
  });
};

// 저장소 생성
export const useCreateGithubRepo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (repoName: string) => createGithubRepo(repoName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['githubSyncSettings'] });
    },
  });
};

// 저장소 상태 확인
export const useCheckGithubRepoStatus = () => {
  return useQuery({
    queryKey: ['githubRepoStatus'],
    queryFn: checkGithubRepoStatus,
    enabled: false, // 수동으로 호출
    retry: 1,
  });
};

// 연결 해제
export const useDisconnectGithubSync = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: disconnectGithubSync,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['githubSyncSettings'] });
    },
  });
};
