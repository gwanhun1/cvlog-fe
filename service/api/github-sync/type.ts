export interface GithubSyncSettings {
  enabled: boolean;
  repoId: number | null;
  repoName: string | null;
  syncedPostCount: number;
}

export interface GithubRepoResponse {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
}

export interface GithubRepoStatus {
  exists: boolean;
  name?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
