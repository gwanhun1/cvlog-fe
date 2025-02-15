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
          // GitHub 인증 코드로 백엔드 API 호출
          const response = await axiosInstance.get('/auth/login', {
            params: { code },
          });

          if (
            response.data &&
            response.data.data &&
            response.data.data.accessToken
          ) {
            // 토큰 저장
            await LocalStorage.setItem(
              'CVtoken',
              response.data.data.accessToken
            );
            
            // 리프레시 토큰 쿠키에 저장
            if (response.data.data.refreshToken) {
              Cookie.setItem('refreshToken', response.data.data.refreshToken, 7); // 7일 동안 유효
            }

            // 사용자 정보 저장
            if (response.data.data.userInfo) {
              setUserInfo(response.data.data.userInfo);
            }

            // 메인 페이지로 리다이렉트
            router.push('/about');
          } else {
            console.error('Invalid response data:', response.data);
            router.push('/');
          }
        }
      } catch (error) {
        console.error('Error processing login:', error);
        router.push('/');
      }
    };

    if (router.isReady) {
      handleCallback();
    }
  }, [router, router.isReady, setUserInfo]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse">Processing login...</div>
    </div>
  );
}
