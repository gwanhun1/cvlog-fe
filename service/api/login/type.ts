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
export type AuthProvider = 'github' | 'google' | 'kakao' | 'naver';

/** 서버가 계산해서 내려주는 기능 가능 여부. FE는 github_id로 기능을 판단하지 않는다. */
export interface UserCapabilities {
  githubSync: boolean;
  githubStats: boolean;
}

export interface UserInfoType {
  created_at: string;
  deleted_at: null;
  description: string | null;
  /**
   * @deprecated 표시·인증 판단에 쓰지 말 것. GitHub 연동 유저에게만 존재한다.
   * 표시명은 username, 기능 노출은 capabilities를 쓴다.
   */
  github_id: string | null;
  /** provider 무관 공개 핸들 */
  username: string | null;
  id: number;
  name: string;
  profile_image: string;
  refresh_token: string;
  updated_at: string;
  providers?: AuthProvider[];
  capabilities?: UserCapabilities;
}

export interface ErrorResponse {
  response: {
    status: number;
  };
}
