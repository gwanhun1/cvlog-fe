export interface GetNewTokenApi {
  headers: {
    refreshToken: string;
    Authorization: string;
  };
}

export interface GetRefreshTokenApi {
  data: {
    headers: {
      refreshToken: string;
      Authorization: string;
    };
    success: boolean;
  };
}

export interface UserInfoApi {
  accessToken: string;
}

export interface SignOut {
  success: boolean;
  data: string;
}

export interface ErrorResponse {
  response: {
    status: number;
  };
}

export interface UserInfo {
  data: UserInfoType;
  success: boolean;
}
export interface UserInfoType {
  created_at: string;
  deleted_at: null;
  description: string | null;
  github_id: string;
  id: number;
  name: string;
  profile_image: string;
  refresh_token: string;
  updated_at: string;
}

export interface ErrorResponse {
  response: {
    status: number;
  };
}
