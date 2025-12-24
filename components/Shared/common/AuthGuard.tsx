import { useEffect, useState, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { postRefreshToken } from 'service/api/login';
import LocalStorage from 'public/utils/Localstorage';
import Cookie from 'public/utils/Cookie';
import LoaderAnimation from './LoaderAnimation';

const AuthGuard = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const isSSR = typeof window === 'undefined';

  const [isLoading, setIsLoading] = useState(() => {
    if (isSSR) return false;
    const hasToken = !!LocalStorage.getItem('LogmeToken');
    const hasRefreshToken = !!Cookie.getItem('refreshToken');
    return !hasToken && hasRefreshToken; // 액세스 토큰은 없는데 리프레시 토큰은 있는 경우에만 로딩 표시하며 갱신 시도
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (isSSR) return true;
    return !!LocalStorage.getItem('LogmeToken');
  });

  const checkAuthStatus = useCallback(async () => {
    const accessToken = LocalStorage.getItem('LogmeToken');
    const refreshToken = Cookie.getItem('refreshToken');

    if (!accessToken) {
      if (refreshToken) {
        setIsLoading(true);
        try {
          const refreshParams = {
            headers: {
              refreshToken,
              Authorization: `Bearer ${accessToken || ''}`,
            },
          };

          const response = await postRefreshToken(refreshParams);

          if (response?.data?.accessToken) {
            LocalStorage.setItem('LogmeToken', response.data.accessToken);
            setIsAuthenticated(true);
          } else {
            Cookie.removeItem('refreshToken');
            LocalStorage.removeItem('LogmeToken');
            router.push(`/login?redirect=${router.asPath}`);
          }
        } catch (error) {
          console.error('인증 갱신 실패:', error);
          router.push(`/login?redirect=${router.asPath}`);
        } finally {
          setIsLoading(false);
        }
      } else {
        router.push(`/login?redirect=${router.asPath}`);
      }
    } else {
      setIsAuthenticated(true);
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  if (isLoading) {
    return <LoaderAnimation />;
  }

  if (!isAuthenticated && !isSSR) {
    return null; // 리다이렉트 중일 때는 아무것도 렌더링하지 않음
  }

  return <>{children}</>;
};

export default AuthGuard;
