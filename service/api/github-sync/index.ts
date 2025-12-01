import { axiosInstance } from 'utils/axios';
import {
  GithubSyncSettings,
  GithubRepoResponse,
  GithubRepoStatus,
  ApiResponse,
} from './type';

// GitHub 동기화 설정 조회
export const getGithubSyncSettings = async (): Promise<GithubSyncSettings> => {
  const { data } = await axiosInstance.get<ApiResponse<GithubSyncSettings>>(
    '/users/github-sync'
  );
  return data.data;
};

// GitHub 저장소 생성
export const createGithubRepo = async (
  repoName: string
): Promise<GithubRepoResponse> => {
  const { data } = await axiosInstance.post<ApiResponse<GithubRepoResponse>>(
    '/users/github-sync/repo',
    { repoName }
  );
  return data.data;
};

// GitHub 저장소 상태 확인
export const checkGithubRepoStatus = async (): Promise<GithubRepoStatus> => {
  const { data } = await axiosInstance.get<ApiResponse<GithubRepoStatus>>(
    '/users/github-sync/status'
  );
  return data.data;
};

// GitHub 동기화 연결 해제
export const disconnectGithubSync = async (): Promise<void> => {
  await axiosInstance.delete('/users/github-sync');
};
