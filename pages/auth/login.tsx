import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSetRecoilState } from 'recoil';
import LocalStorage from 'public/utils/Localstorage';
import { axiosInstance } from '../../service/axios';
import { userIdAtom } from '../../service/atoms/atoms';
import Cookie from 'public/utils/Cookie';

export default function LoginCallback() {
  const router = useRouter();
  const setUserInfo = useSetRecoilState(userIdAtom);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { code } = router.query;

        if (code) {
          let retryCount = 0;
          const maxRetries = 3; // 최대 3번 시도

          while (retryCount < maxRetries) {
            try {
              const response = await axiosInstance.get('/auth/login', {
                params: { code },
              });

              if (response.data?.data?.accessToken) {
                await LocalStorage.setItem(
                  'CVtoken',
                  response.data.data.accessToken
                );

                if (response.data.data.refreshToken) {
                  Cookie.setItem(
                    'refreshToken',
                    response.data.data.refreshToken,
                    7
                  );
                }

                if (response.data.data.userInfo) {
                  setUserInfo(response.data.data.userInfo);
                }

                router.push('/about');
                return; // 성공하면 즉시 종료
              }
            } catch (err) {
              retryCount++;
              if (retryCount < maxRetries) {
                // 재시도 전 잠시 대기 (시간을 점점 늘림)
                await new Promise(resolve =>
                  setTimeout(resolve, retryCount * 1500)
                );
                continue;
              }
            }
          }

          // 모든 재시도 실패 후 조용히 메인으로 리다이렉트
          router.push('/');
        }
      } catch (error) {
        console.error('Login error:', error);
        router.push('/'); // 에러 파라미터 없이 리다이렉트
      }
    };

    if (router.query.code) {
      handleCallback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.code]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse">Processing login...</div>
    </div>
  );
}
