import { useRecoilState } from 'recoil';
import { userIdAtom } from 'service/atoms/atoms';
import LocalStorage from 'public/utils/Localstorage';
import { useGetUserInfo } from 'service/hooks/Login';
import { useEffect, useState, useRef } from 'react';

const useIsLogin = () => {
  const [userInfo, setUserInfo] = useRecoilState(userIdAtom);
  const accessToken = LocalStorage.getItem('LogmeToken') as string;
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!accessToken);
  const hasFetched = useRef(false);

  // useGetUserInfo 훅 호출 - enabled 옵션으로 조건부 실행
  const { data, isSuccess } = useGetUserInfo();

  // 데이터가 성공적으로 로드되면 상태 업데이트
  useEffect(() => {
    if (isSuccess && data && !hasFetched.current) {
      setUserInfo(data);
      setIsAuthenticated(true);
      hasFetched.current = true;
    }
  }, [isSuccess, data, setUserInfo]);

  // 토큰이 있으면 즉시 인증 상태로 설정 (API 응답 대기 없이)
  useEffect(() => {
    if (accessToken) {
      setIsAuthenticated(true);
    }
  }, [accessToken]);

  return { isAuthenticated, isLoading };
};

export default useIsLogin;
