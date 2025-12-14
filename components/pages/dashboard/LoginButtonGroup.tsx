import Cookie from 'public/utils/Cookie';
import LocalStorage from 'public/utils/Localstorage';
import { useEffect, useState } from 'react';
import { useToast } from 'components/Shared';
import { FcGoogle } from 'react-icons/fc';
import { SiNaver } from 'react-icons/si';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { FaGithub } from 'react-icons/fa';

const LoginButtonGroup = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const token = LocalStorage.getItem('LogmeToken');
  const { showToast, showConfirm } = useToast();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');

    if (!sessionStorage.getItem('cleared')) {
      localStorage.clear();
      sessionStorage.clear();
      sessionStorage.setItem('cleared', 'true');
    }

    if (error === 'auth_failed') {
      showToast('로그인에 실패했습니다. 잠시 후 다시 시도해주세요.', 'error');
      console.error('GitHub OAuth 인증 실패:', error);
    }
  }, [showToast]);

  useEffect(() => {
    setMounted(true);
    token && setAccessToken(token);
  }, [token]);

  if (!mounted) return null;

  const handleLogin = (loginMethod: string, event: React.MouseEvent) => {
    if (accessToken) {
      showConfirm(
        '기존 로그인 기록이 있습니다. 다시 로그인하시겠습니까?',
        () => {
          LocalStorage.removeItem('LogmeToken');
          Cookie.removeItem('refreshToken');
          proceedLogin(loginMethod);
        }
      );
      event.preventDefault();
      return;
    }
    proceedLogin(loginMethod);
  };

  const proceedLogin = (loginMethod: string) => {
    if (loginMethod === 'Github') {
      const githubId = process.env.NEXT_PUBLIC_GITHUB_ID;
      const redirectUri = process.env.NEXT_PUBLIC_URL;

      if (!githubId || !redirectUri) {
        console.error('GitHub OAuth 설정이 누락되었습니다:', {
          githubId,
          redirectUri,
        });
        showToast(
          'GitHub 로그인 설정이 잘못되었습니다. 관리자에게 문의하세요.',
          'error'
        );
        return;
      }

      // 상태 변수 추가 - CSRF 보호용
      const state = Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('github_oauth_state', state);

      window.location.href = `https://github.com/login/oauth/authorize?client_id=${githubId}&redirect_uri=${redirectUri}&state=${state}&scope=repo delete_repo`;
    } else {
      showToast('준비 중입니다.', 'info');
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div
        key={loginMethodArr[0].id}
        onClick={event => handleLogin(loginMethodArr[0].method, event)}
        className="w-full transition-all duration-300 transform cursor-pointer group hover:-translate-y-2"
      >
        <div className="bg-[#27272a] flex items-center justify-center gap-3 p-4 rounded-3xl border border-gray-200 shadow-lg hover:shadow-2xl  transition-all">
          <div className="z-20 p-2">{loginMethodArr[0].image}</div>
          <span className="font-semibold text-white">
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
    image: <FaGithub className="w-6 h-6 text-white" />,
  },
  {
    id: 2,
    name: 'Google',
    method: 'Google',
    image: <FcGoogle className="w-6 h-6" />,
  },
  {
    id: 3,
    name: 'Naver',
    method: '네이버',
    image: <SiNaver className="w-6 h-6" color="#03c75a" />,
  },
  {
    id: 4,
    name: 'Kakao',
    method: '카카오',
    image: (
      <div className="p-1 bg-yellow-400 rounded-2xl">
        <RiKakaoTalkFill className="w-4 h-4" />
      </div>
    ),
  },
];
