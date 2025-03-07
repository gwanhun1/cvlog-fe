import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import Loader from 'components/Shared/common/Loader';
import Cookie from 'public/utils/Cookie';
import LocalStorage from 'public/utils/Localstorage';
import { useSetRecoilState } from 'recoil';
import { userIdAtom } from 'service/atoms/atoms';
import { useRouter } from 'next/router';
axios.defaults.withCredentials = true;

const Join = ({ info, cookie }: JoinProps) => {
  const setUserInfo = useSetRecoilState(userIdAtom);
  const router = useRouter();

  const cookies = Object.fromEntries(
    cookie.split(';').map((cookie: string) => cookie.trim().split('='))
  );

  useEffect(() => {
    LocalStorage.setItem('CVtoken', info.data.accessToken);
    Cookie.setItem('refreshToken', cookies.refreshToken, 1);

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
        router.push('/');
      } catch (error) {
        console.error('Error fetching user info:', error);
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

//ssr 소셜 로그인 애러 해결
export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const { query } = context;
    const { code } = query;

    if (!code) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login?code=${code}`,
      {
        withCredentials: true,
        timeout: 5000,
      }
    );

    const info = response.data;
    const setLocalCookie: string[] = response.headers['set-cookie'] as string[];
    const cookie: string = setLocalCookie?.[0] || '';

    if (!info || !cookie) {
      throw new Error('Invalid response from server');
    }

    return { props: { info, cookie } };
  } catch (error) {
    console.error('Login error:', error);
    return {
      redirect: {
        destination: '/?error=auth_failed',
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
