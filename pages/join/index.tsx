import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import Loader from 'components/Shared/common/Loader';
import Cookie from 'public/utils/Cookie';
import LocalStorage from 'public/utils/Localstorage';
import { useSetRecoilState } from 'recoil';
import {
  accessTokenAtom,
  refreshTokenAtom,
  userIdAtom,
} from 'service/atoms/atoms';
import { useRouter } from 'next/router';
axios.defaults.withCredentials = true;

const Join = ({ info, cookie }: JoinProps) => {
  const setUserInfo = useSetRecoilState(userIdAtom);
  const setAccessToken = useSetRecoilState(accessTokenAtom);
  const setRefreshToken = useSetRecoilState(refreshTokenAtom);

  const router = useRouter();

  const cookies = Object.fromEntries(
    cookie.split(';').map((cookie: string) => cookie.trim().split('='))
  );

  useEffect(() => {
    LocalStorage.setItem('LogmeToken', info.data.accessToken);
    // 1주일 동안 유효한 refreshToken (7일)
    Cookie.setItem('refreshToken', cookies.refreshToken, 7);

    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/info`,
          {
            headers: {
              Authorization: `Bearer ${info.data.accessToken}`,
            },
          }
        );
        setUserInfo(response.data.data);
        setAccessToken(info.data.accessToken);
        setRefreshToken(cookies.refreshToken);
        router.push('/');
      } catch (error) {
        console.error('Error fetching user info:', error);
        router.push('/?error=user_info_failed');
      }
    };

    fetchUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies.refreshToken, info.data.accessToken, setUserInfo]);

  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <Loader />
    </div>
  );
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
          destination: '/?error=missing_code',
          permanent: false,
        },
      };
    }

    const maxRetries = 3;
    let retryCount = 0;
    let response;
    let lastError;

    while (retryCount < maxRetries) {
      try {
        console.log(
          `GitHub OAuth 요청 시도 ${retryCount + 1}/${maxRetries}:`,
          code
        );

        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login?code=${code}`;
        console.log('요청 URL:', url);

        response = await axios.get(url, {
          withCredentials: true,
          timeout: 15000,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });

        console.log('GitHub OAuth 응답 상태:', response.status);
        break;
      } catch (error: any) {
        lastError = error;
        console.error(
          `GitHub OAuth 요청 실패 (시도 ${retryCount + 1}/${maxRetries}):`,
          error.response?.status,
          error.response?.data || error.message
        );

        retryCount++;
        if (retryCount >= maxRetries) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 2000 * retryCount));
      }
    }

    if (!response) {
      console.error('GitHub OAuth 응답이 없습니다:', lastError);
      throw new Error('Failed to get response after retries');
    }

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

    // 좀 더 구체적인 에러 메시지로 리디렉션
    let errorParam = 'auth_failed';

    if (error.response?.status === 404) {
      errorParam = 'api_not_found';
    } else if (error.response?.status === 401) {
      errorParam = 'unauthorized';
    } else if (error.code === 'ECONNABORTED') {
      errorParam = 'timeout';
    } else if (error.code === 'ECONNREFUSED') {
      errorParam = 'connection_refused';
    }

    return {
      redirect: {
        destination: `/?error=${errorParam}`,
        permanent: false,
      },
    };
  }
};

interface Info {
  data: { accessToken: string };
}

type JoinProps = {
  info: Info;
  cookie: string;
};
