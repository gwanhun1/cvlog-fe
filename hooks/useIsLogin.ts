import { useStore } from 'service/store/useStore';
import LocalStorage from 'public/utils/Localstorage';
import { useGetUserInfo } from 'service/hooks/Login';
import { useEffect, useState, useRef } from 'react';

const useIsLogin = () => {
  const userInfo = useStore((state) => state.userIdAtom);
  const setUserInfo = useStore((state) => state.setUserIdAtom);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    const accessToken = LocalStorage.getItem('LogmeToken') as string;

    if (accessToken) {
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, []);

  const { data, isSuccess } = useGetUserInfo();

  useEffect(() => {
    if (isSuccess && data && !hasFetched.current) {
      setUserInfo(data);
      hasFetched.current = true;
    }
  }, [isSuccess, data, setUserInfo]);

  return { isAuthenticated, isLoading };
};

export default useIsLogin;
