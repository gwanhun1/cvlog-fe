import React, { useEffect } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import axios from 'axios';
import Cookie from 'public/utils/Cookie';
import LocalStorage from 'public/utils/Localstorage';
import { useSetRecoilState } from 'recoil';
import {
  accessTokenAtom,
  refreshTokenAtom,
  userIdAtom,
} from 'service/atoms/atoms';
import { useRouter } from 'next/router';
import LoaderAnimation from 'components/Shared/common/LoaderAnimation';

axios.defaults.withCredentials = true;

interface Info {
  data: { accessToken: string };
}

interface JoinProps {
  info: Info;
  cookie: string;
}

const Join: NextPage<JoinProps> = ({ info, cookie }) => {
  const setUserInfo = useSetRecoilState(userIdAtom);
  const setAccessToken = useSetRecoilState(accessTokenAtom);
  const setRefreshToken = useSetRecoilState(refreshTokenAtom);

  const router = useRouter();

  const cookies = Object.fromEntries(
    cookie.split(';').map((cookie: string) => cookie.trim().split('='))
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
      console.error('GitHub OAuth 코드가 없습니다:', query);
      return {
        redirect: {
          destination: '/login?error=missing_code',
          permanent: false,
        },
      };
    }

    console.log('GitHub OAuth 요청:', code);

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login?code=${code}`;
    console.log('요청 URL:', url);

    const response = await axios.get(url, {
      withCredentials: true,
      timeout: 30000,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    console.log('GitHub OAuth 응답 상태:', response.status);

    const info = response.data;
    const setLocalCookie: string[] = response.headers['set-cookie'] as string[];
    const cookie: string = setLocalCookie?.[0] || '';

    if (!info || !cookie) {
      console.error('GitHub OAuth 응답이 잘못되었습니다:', { info, cookie });
      throw new Error('Invalid response from server');
    }

    console.log('GitHub OAuth 성공:', {
      hasAccessToken: !!info.data?.accessToken,
      hasCookie: !!cookie,
    });

    return { props: { info, cookie } };
  } catch (error: any) {
    console.error('로그인 에러:', error.message, error.response?.data);

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
