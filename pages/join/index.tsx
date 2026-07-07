import React, { useEffect, useRef } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import axios from 'axios';
import Cookie from 'public/utils/Cookie';
import LocalStorage from 'public/utils/Localstorage';
import { useStore } from 'service/store/useStore';
import { useRouter } from 'next/router';
import LoaderAnimation from 'components/Shared/common/LoaderAnimation';
import { trackEvent, isNewSignup } from 'utils/analytics';

axios.defaults.withCredentials = true;

interface Info {
  data: { accessToken: string; isNewUser?: boolean };
}

interface JoinProps {
  info: Info;
  cookie: string;
}

const Join: NextPage<JoinProps> = ({ info, cookie }) => {
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
          trackEvent('sign_up', { method: 'github' });
        } else {
          trackEvent('login', { method: 'github' });
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
    const { code } = query;

    if (!code) {
      return {
        redirect: {
          destination: '/login?error=missing_code',
          permanent: false,
        },
      };
    }

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login?code=${code}`;

    const response = await axios.get(url, {
      withCredentials: true,
      timeout: 30000,
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

    return { props: { info, cookie } };
  } catch (error: any) {
    console.error('로그인 에러:', error?.message);

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
        destination: `/login?error=${errorParam}`,
        permanent: false,
      },
    };
  }
};
