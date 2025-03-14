import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useRefreshToken } from 'service/hooks/Login';
import { postRefreshToken } from 'service/api/login';
import LocalStorage from 'public/utils/Localstorage';
import Cookie from 'public/utils/Cookie';
import Loader from './Loader';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthStatus = useCallback(async () => {
    setIsLoading(true);

    try {
      const accessToken = LocalStorage.getItem('LogmeToken');
      const refreshToken = Cookie.getItem('refreshToken');

      // 엑세스 토큰이 없는 경우
      if (!accessToken) {
        // 리프레시 토큰이 있는 경우 새 엑세스 토큰 발급 시도
        if (refreshToken) {
          try {
            const refreshParams = {
              headers: {
                refreshToken: refreshToken,
                Authorization: `Bearer ${accessToken || ''}`,
              },
            };

            const response = await postRefreshToken(refreshParams);

            if (response && response.data && response.data.accessToken) {
              if (response.data.accessToken !== '') {
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
  }, [router]);

  useEffect(() => {
    if (router.pathname === '/login' || router.pathname === '/join') {
      setIsLoading(false);
      return;
    }

    checkAuthStatus();
  }, [router.pathname, checkAuthStatus]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-80 z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
          <div className="relative mx-auto mb-6">
            <Loader />
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            데이터 동기화 중
          </h3>
          <p className="text-gray-600 mb-4">잠시만 기다려 주세요...</p>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div className="bg-blue-500 h-2 rounded-full animate-pulse"></div>
          </div>
          <p className="text-xs text-gray-500">서버와 통신하는 중입니다</p>
        </div>
      </div>
    );
  }

  if (
    !isAuthenticated &&
    router.pathname !== '/login' &&
    router.pathname !== '/join'
  ) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
