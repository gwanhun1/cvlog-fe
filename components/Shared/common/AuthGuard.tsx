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
    '/404',
    '/_error',
  ];

  const isPublicRoute = publicRoutes.some(route => {
    if (typeof route === 'string') {
      return route === router.pathname;
    }
    return route.test(router.asPath);
  });

  // 초기 로딩 상태: public route이거나 이미 토큰이 있으면 로딩 스킵
  const [isLoading, setIsLoading] = useState(() => {
    if (isSSR) return false;
    if (isPublicRoute) return false;
    // 토큰이 이미 있으면 로딩 없이 바로 렌더링
    const hasToken = !!LocalStorage.getItem('LogmeToken');
    return !hasToken;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (isSSR) return true;
    if (isPublicRoute) return true;
    // 토큰이 있으면 인증된 것으로 간주
    return !!LocalStorage.getItem('LogmeToken');
  });

  const checkAuthStatus = useCallback(async () => {
    if (isPublicRoute) {
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const accessToken = LocalStorage.getItem('LogmeToken');
      const refreshToken = Cookie.getItem('refreshToken');

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
    if (isPublicRoute) {
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    const accessToken = LocalStorage.getItem('LogmeToken');
    if (accessToken) {
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    checkAuthStatus();
  }, [router.pathname, isPublicRoute, checkAuthStatus]);

  if (isLoading && !isPublicRoute) {
    return <LoaderAnimation />;
  }

  return (
    <div style={{ opacity: isLoading ? 0.7 : 1, transition: 'opacity 0.2s' }}>
      {children}
    </div>
  );
};

export default AuthGuard;
