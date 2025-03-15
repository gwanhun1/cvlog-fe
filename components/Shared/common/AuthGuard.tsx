import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { postRefreshToken } from 'service/api/login';
import LocalStorage from 'public/utils/Localstorage';
import Cookie from 'public/utils/Cookie';
import LoaderAnimation from './LoaderAnimation';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 로그인 없이 접근 가능한 경로 목록
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const publicRoutes = [
    '/',
    '/join',
    '/login',
    '/article',
    /^\/article\/all\/\d+$/,
  ];

  const checkAuthStatus = useCallback(async () => {
    setIsLoading(true);

    try {
      const accessToken = LocalStorage.getItem('LogmeToken');
      const refreshToken = Cookie.getItem('refreshToken');

      // 현재 경로가 publicRoutes에 포함되는지 확인
      const isPublicRoute = publicRoutes.some(route =>
        typeof route === 'string'
          ? route === router.pathname
          : route.test(router.pathname)
      );

      if (isPublicRoute) {
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      // 엑세스 토큰이 없는 경우
      if (!accessToken) {
        if (refreshToken) {
          try {
            const refreshParams = {
              headers: {
                refreshToken,
                Authorization: `Bearer ${accessToken || ''}`,
              },
            };

            const response = await postRefreshToken(refreshParams);

            if (response?.data?.accessToken) {
              await LocalStorage.setItem(
                'LogmeToken',
                response.data.accessToken
              );
              setIsAuthenticated(true);
            } else {
              Cookie.removeItem('refreshToken');
              LocalStorage.removeItem('LogmeToken');
              router.push('/login');
            }
          } catch (error) {
            console.error('리프레시 토큰으로 인증 실패:', error);
            router.push('/login');
          }
        } else {
          router.push('/login');
        }
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('인증 확인 중 오류 발생:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [publicRoutes, router]);

  useEffect(() => {
    if (router.pathname === '/login' || router.pathname === '/join') {
      setIsLoading(false);
      return;
    }

    checkAuthStatus();
  }, [router.pathname, checkAuthStatus]);

  if (isLoading) {
    return <LoaderAnimation />;
  }

  if (
    !isAuthenticated &&
    !publicRoutes.some(route =>
      typeof route === 'string'
        ? route === router.pathname
        : route.test(router.pathname)
    )
  ) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
