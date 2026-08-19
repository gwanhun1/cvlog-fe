import React, { useEffect, useRef } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import axios from 'axios';
import Cookie from 'public/utils/Cookie';
import LocalStorage from 'public/utils/Localstorage';
import { useStore } from 'service/store/useStore';
import { useRouter } from 'next/router';
import LoaderAnimation from 'components/Shared/common/LoaderAnimation';
import { trackEvent, isNewSignup } from 'utils/analytics';
import { LOGIN_STATE_KEY, parseProviderFromState } from 'utils/oauth';
import type { AuthProvider } from 'service/api/login/type';

axios.defaults.withCredentials = true;

// OAuth 공급자 통신(각 15초)과 DB 갱신이 순차 실행되므로 30초는 경계값에 가깝다.
// Vercel 함수 제한(60초)보다 짧게 두어 실패 시에도 에러 리다이렉트 시간을 확보한다.
const OAUTH_CALLBACK_TIMEOUT_MS = 45_000;

interface Info {
  data: { accessToken: string; isNewUser?: boolean };
}

interface JoinProps {
  info: Info;
  cookie: string;
  provider: AuthProvider;
}

const Join: NextPage<JoinProps> = ({ info, cookie, provider }) => {
  const setUserInfo = useStore((state) => state.setUserIdAtom);
  const setAccessToken = useStore((state) => state.setAccessTokenAtom);
  const setRefreshToken = useStore((state) => state.setRefreshTokenAtom);

  const router = useRouter();
  const initializedRef = useRef(false);

  const cookies = Object.fromEntries(
    cookie.split(';').map((c: string) => {
      const [key, ...rest] = c.trim().split('=');
      return [key, rest.join('=')];
    })
  );

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        LocalStorage.setItem('LogmeToken', info.data.accessToken);
        Cookie.setItem('refreshToken', cookies.refreshToken, 7);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/info`,
          {
            headers: {
              Authorization: `Bearer ${info.data.accessToken}`,
            },
          }
        );

        const userData = response.data.data;
        setUserInfo(userData);
        setAccessToken(info.data.accessToken);
        setRefreshToken(cookies.refreshToken);

        // GA4 이벤트: OAuth 인증 성공 시점.
        // 신규가입 여부는 백엔드 /auth/login의 isNewUser 플래그가 기준.
        // 플래그가 없는 구버전 백엔드 응답이면 created_at 60초 휴리스틱으로 폴백.
        const isNew =
          info.data.isNewUser ?? isNewSignup(userData?.created_at);
        if (isNew) {
          trackEvent('sign_up', { method: provider });
        } else {
          trackEvent('login', { method: provider });
        }

        LocalStorage.setItem('user_info', JSON.stringify(userData));

        window.dispatchEvent(new Event('storage'));

        await router.push('/');
      } catch (error) {
        console.error('Error fetching user info:', error);
        LocalStorage.removeItem('LogmeToken');
        Cookie.removeItem('refreshToken');
        router.push('/login?error=user_info_failed');
      }
    };

    // StrictMode 이중 마운트/향후 deps 변경에도 인증 처리와 GA 이벤트가
    // 정확히 한 번만 실행되도록 가드
    if (initializedRef.current) return;
    initializedRef.current = true;

    // GA 자동 page_view가 OAuth code/state 쿼리를 수집하지 않도록
    // gtag 처리 전에 주소창에서 제거
    window.history.replaceState({}, '', '/join');

    // 소비된 state는 재사용되지 않도록 정리
    sessionStorage.removeItem(LOGIN_STATE_KEY);

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <LoaderAnimation />;
};
export default Join;
//ssr 소셜 로그인 처리
export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const { query } = context;
    const { code, state } = query;

    if (!code) {
      return {
        redirect: {
          destination: '/login?error=missing_code',
          permanent: false,
        },
      };
    }

    // state에 provider가 실려 돌아온다(`<provider>.<random>`).
    // 구버전 클라이언트가 남긴 state 없는 콜백은 GitHub으로 간주한다.
    const provider = parseProviderFromState(state) ?? 'github';

    // 구글·카카오는 토큰 교환 때 인가 시점과 동일한 redirect_uri를 요구한다.
    const host = context.req.headers.host ?? '';
    const proto =
      (context.req.headers['x-forwarded-proto'] as string | undefined) ??
      (host.startsWith('localhost') ? 'http' : 'https');
    const redirectUri = `${proto}://${host}/join`;

    const params = new URLSearchParams({
      code: String(code),
      redirect_uri: redirectUri,
    });
    if (typeof state === 'string') params.set('state', state);

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/${provider}/login?${params.toString()}`;

    const response = await axios.get(url, {
      withCredentials: true,
      timeout: OAUTH_CALLBACK_TIMEOUT_MS,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const info = response.data;
    const setLocalCookie: string[] = response.headers['set-cookie'] as string[];
    const cookie: string =
      setLocalCookie?.find(c => c.trimStart().startsWith('refreshToken')) || '';

    if (!info || !cookie) {
      throw new Error('Invalid response from server');
    }

    return { props: { info, cookie, provider } };
  } catch (error: any) {
    console.error('로그인 에러:', error?.message);

    const provider =
      parseProviderFromState(context.query?.state) ?? 'github';
    let errorParam = 'auth_failed';

    if (error.response?.status === 404) {
      errorParam = 'api_not_found';
    } else if (error.response?.status === 401) {
      errorParam = 'unauthorized';
    } else if (error.response?.status === 504) {
      errorParam = 'gateway_timeout';
    } else if (error.response?.status === 503) {
      errorParam = 'service_unavailable';
    } else if (error.code === 'ECONNABORTED') {
      errorParam = 'timeout';
    } else if (error.code === 'ECONNREFUSED') {
      errorParam = 'connection_refused';
    } else if (error.code === 'ENOTFOUND') {
      errorParam = 'dns_error';
    }

    return {
      redirect: {
        destination: `/login?error=${errorParam}&provider=${provider}`,
        permanent: false,
      },
    };
  }
};

// Pages Router에서는 config를 통해 Vercel 함수 실행 제한을 전달한다.
export const config = {
  maxDuration: 60,
};
