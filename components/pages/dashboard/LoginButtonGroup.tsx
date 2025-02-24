import * as Shared from 'components/Shared';
import LocalStorage from 'public/utils/Localstorage';
import { useEffect, useState } from 'react';

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
      alert('서버가 자고 있어요..😢 잠시 후 다시 로그인 해주세요.');
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    token && setAccessToken(token);
  }, [token]);

  if (!mounted) return null;

  const handleLogin = (loginMethod: string, event: React.MouseEvent) => {
    if (loginMethod === 'Github') {
      window.location.href = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_ID}&redirect_uri=${process.env.NEXT_PUBLIC_URL}`;
    } else {
      event.preventDefault();
      alert('준비 중입니다.');
    }

    if (accessToken) {
      event.preventDefault();
      return;
    }
  };

  return (
    <div className="grid grid-cols-2 tablet:grid-cols-4 gap-4 w-full">
      {loginMethodArr.map(item => (
        <div
          key={item.id}
          onClick={event => handleLogin(item.method, event)}
          className="group transform transition-all duration-300 hover:-translate-y-2 hover:scale-105 cursor-pointer"
        >
          <div className="flex flex-col items-center p-4 bg-white/90 backdrop-blur-md rounded-3xl border border-gray-200 shadow-lg hover:shadow-2xl hover:border-blue-200 space-y-3 transition-all">
            <div className="p-3 rounded-full">{item.image}</div>
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
    image: <Shared.LogmeIcon.GithubIcon alt="Github" width={44} height={44} />,
  },
  {
    id: 2,
    name: 'Google',
    method: 'Google',
    image: <Shared.LogmeIcon.GoogleIcon alt="Google" width={44} height={44} />,
  },
  {
    id: 3,
    name: 'Naver',
    method: '네이버',
    image: <Shared.LogmeIcon.NaverIcon alt="Naver" width={44} height={44} />,
  },
  {
    id: 4,
    name: 'Kakao',
    method: '카카오',
    image: <Shared.LogmeIcon.KakaoIcon alt="KaKao" width={44} height={44} />,
  },
];
