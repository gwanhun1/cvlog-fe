import LocalStorage from 'public/utils/Localstorage';
import { useEffect, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { SiNaver } from 'react-icons/si';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { FaGithub } from 'react-icons/fa';

const LoginButtonGroup = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const token = LocalStorage.getItem('LogmeToken');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');

    if (!sessionStorage.getItem('cleared')) {
      localStorage.clear();
      sessionStorage.clear();
      sessionStorage.setItem('cleared', 'true');
    }

    if (error === 'auth_failed') {
      alert('로그인에 실패했습니다. 잠시 후 다시 시도해주세요.');
      console.error('GitHub OAuth 인증 실패:', error);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    token && setAccessToken(token);
  }, [token]);

  if (!mounted) return null;

  const handleLogin = (loginMethod: string, event: React.MouseEvent) => {
    if (accessToken) {
      event.preventDefault();
      alert('로그인 기록이 있습니다.');
      window.location.href = '/';

      return;
    }

    if (loginMethod === 'Github') {
      const githubId = process.env.NEXT_PUBLIC_GITHUB_ID;
      const redirectUri = process.env.NEXT_PUBLIC_URL;

      if (!githubId || !redirectUri) {
        console.error('GitHub OAuth 설정이 누락되었습니다:', {
          githubId,
          redirectUri,
        });
        alert('GitHub 로그인 설정이 잘못되었습니다. 관리자에게 문의하세요.');
        return;
      }

      // 상태 변수 추가 - CSRF 보호용
      const state = Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('github_oauth_state', state);

      window.location.href = `https://github.com/login/oauth/authorize?client_id=${githubId}&redirect_uri=${redirectUri}&state=${state}&scope=user:email`;
    } else {
      event.preventDefault();
      alert('준비 중입니다.');
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div
        key={loginMethodArr[0].id}
        onClick={event => handleLogin(loginMethodArr[0].method, event)}
        className=" group transform transition-all duration-300 hover:-translate-y-2  cursor-pointer w-full"
      >
        <div className="bg-[#27272a] flex items-center justify-center gap-3 p-4 rounded-3xl border border-gray-200 shadow-lg hover:shadow-2xl  transition-all">
          <div className="p-2 z-20">{loginMethodArr[0].image}</div>
          <span className="text-white font-semibold  ">
            {loginMethodArr[0].method}으로 로그인
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginButtonGroup;

const loginMethodArr = [
  {
    id: 1,
    name: 'Github',
    method: 'Github',
    image: <FaGithub className="h-6 w-6  text-white" />,
  },
  {
    id: 2,
    name: 'Google',
    method: 'Google',
    image: <FcGoogle className="h-6 w-6" />,
  },
  {
    id: 3,
    name: 'Naver',
    method: '네이버',
    image: <SiNaver className="h-6 w-6" color="#03c75a" />,
  },
  {
    id: 4,
    name: 'Kakao',
    method: '카카오',
    image: (
      <div className="bg-yellow-400 rounded-2xl p-1">
        <RiKakaoTalkFill className="h-4 w-4" />
      </div>
    ),
  },
];
