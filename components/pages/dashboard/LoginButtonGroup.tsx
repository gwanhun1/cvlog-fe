import LocalStorage from 'public/utils/Localstorage';
import { useEffect, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { SiNaver } from 'react-icons/si';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { FaGithub } from 'react-icons/fa';

const LoginButtonGroup = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const token = LocalStorage.getItem('CVtoken');

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
      return;
    }
    
    if (loginMethod === 'Github') {
      const githubId = process.env.NEXT_PUBLIC_GITHUB_ID;
      const redirectUri = process.env.NEXT_PUBLIC_URL;
      
      if (!githubId || !redirectUri) {
        console.error('GitHub OAuth 설정이 누락되었습니다:', { githubId, redirectUri });
        alert('GitHub 로그인 설정이 잘못되었습니다. 관리자에게 문의하세요.');
        return;
      }
      
      console.log('GitHub 로그인 시도:', { githubId, redirectUri });
      
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
    <div className="grid grid-cols-2 tablet:grid-cols-4 gap-4 w-full ">
      {loginMethodArr.map(item => (
        <div
          key={item.id}
          onClick={event => handleLogin(item.method, event)}
          className="group transform transition-all duration-300 hover:-translate-y-2 hover:scale-105 cursor-pointer "
        >
          <div className="flex flex-col items-center p-4 bg-white/90 backdrop-blur-md rounded-3xl border border-gray-200 shadow-lg hover:shadow-2xl hover:border-blue-200 space-y-3 transition-all">
            <div className="p-3 rounded-full h-14">{item.image}</div>
            <span className="text-sm text-gray-700 font-semibold opacity-80 group-hover:opacity-100 group-hover:text-blue-600">
              {item.method}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoginButtonGroup;

const loginMethodArr = [
  {
    id: 1,
    name: 'Github',
    method: 'Github',
    image: <FaGithub className="h-8 w-8" />,
  },
  {
    id: 2,
    name: 'Google',
    method: 'Google',
    image: <FcGoogle className="h-8 w-8" />,
  },
  {
    id: 3,
    name: 'Naver',
    method: '네이버',
    image: <SiNaver className="h-8 w-6" color="#03c75a" />,
  },
  {
    id: 4,
    name: 'Kakao',
    method: '카카오',
    image: (
      <div className="bg-yellow-400 rounded-2xl p-1">
        <RiKakaoTalkFill className="h-6 w-6" />
      </div>
    ),
  },
];
