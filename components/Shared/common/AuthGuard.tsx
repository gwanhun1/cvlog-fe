import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { postRefreshToken } from 'service/api/login';
import LocalStorage from 'public/utils/Localstorage';
import Cookie from 'public/utils/Cookie';
import LoaderAnimation from './LoaderAnimation';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const isSSR = typeof window === 'undefined';

  const publicRoutes = [
    '/',
    '/join',
    '/login',
    '/article',
    /^\/article\/all\/\d+$/,
    /^\/article\/content\/all\/\d+$/,
    '/article/content/all/[pid]',
  ];

  const isPublicRoute = publicRoutes.some(route => {
    if (typeof route === 'string') {
      return route === router.pathname;
    }
    return route.test(router.asPath);
  });

  const [isLoading, setIsLoading] = useState(() => {
    if (isSSR) return false;
    return !isPublicRoute;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (isSSR) return true;
    return isPublicRoute;
  });

  const checkAuthStatus = useCallback(async () => {
    setIsLoading(true);

    try {
      const accessToken = LocalStorage.getItem('LogmeToken');
      const refreshToken = Cookie.getItem('refreshToken');

      if (isPublicRoute) {
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

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
  }, [isPublicRoute, router]);

  useEffect(() => {
    if (router.pathname === '/login' || router.pathname === '/join') {
      setIsLoading(false);
      return;
    }

    if (isPublicRoute) {
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    checkAuthStatus();
  }, [router.pathname, isPublicRoute, checkAuthStatus]);

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
