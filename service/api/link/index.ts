import { axiosInstance } from 'utils/axios';
import type { AuthProvider } from 'service/api/login/type';

interface LinkParams {
  provider: AuthProvider;
  code: string;
  redirectUri: string;
  state?: string;
}

/**
 * 현재 로그인된 계정에 소셜 로그인 수단을 추가 연결한다.
 *
 * 로그인(/auth/:provider/login)과 달리 새 세션을 만들지 않는다.
 * axiosInstance가 기존 accessToken을 실어 보내고, 서버는 그 JWT의 계정에 identity를 붙인다.
 */
export const linkProvider = async ({
  provider,
  code,
  redirectUri,
  state,
}: LinkParams): Promise<{ provider: AuthProvider }> => {
  const params = new URLSearchParams({ code, redirect_uri: redirectUri });
  if (state) params.set('state', state);

  const { data } = await axiosInstance.post<{
    success: boolean;
    data: { provider: AuthProvider };
  }>(`/users/link/${provider}?${params.toString()}`);

  return data.data;
};

/** 연동 해제. 서버가 마지막 남은 로그인 수단은 거절한다. */
export const unlinkProvider = async (provider: AuthProvider): Promise<void> => {
  await axiosInstance.delete(`/users/link/${provider}`);
};
