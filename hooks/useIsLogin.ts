import { useRecoilState } from 'recoil';
import { userIdAtom } from 'service/atoms/atoms';
import LocalStorage from 'public/utils/Localstorage';
import { useGetUserInfo } from 'service/hooks/Login';
import { useEffect, useState } from 'react';

const useIsLogin = () => {
  const [userInfo, setUserInfo] = useRecoilState(userIdAtom);
  const accessToken = LocalStorage.getItem('LogmeToken') as string;
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // useGetUserInfo 훅 호출 (컴포넌트 레벨에서 호출)
  const { refetch } = useGetUserInfo(data => {
    if (data) {
      setUserInfo(data);
      setIsAuthenticated(true);
      setIsLoading(false);
    }
  });

  useEffect(() => {
    // 토큰은 있지만 유저 정보가 없는 경우 (리코일 데이터 초기화된 경우)
    if (accessToken && userInfo.github_id === '') {
      setIsLoading(true);
      refetch().catch(error => {
        console.error('Failed to fetch user info:', error);
        setIsLoading(false);
      });
    } else if (accessToken && userInfo.github_id !== '') {
      // 토큰과 유저 정보가 모두 있는 경우
      setIsAuthenticated(true);
    }
  }, [accessToken, userInfo.github_id, refetch]);

  return { isAuthenticated, isLoading };
};

export default useIsLogin;
