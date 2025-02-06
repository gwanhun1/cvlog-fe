import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import * as Shared from 'components/Shared';
import LocalStorage from 'public/utils/Localstorage';

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

const ButtonGroup = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setAccessToken(LocalStorage.getItem('CVtoken'));
  }, []);

  if (!mounted) return null;

  const handleLogin = loginMethod => {
    if (accessToken) return '/about';
    switch (loginMethod) {
      case 'Github':
        return `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_ID}&redirect_uri=${process.env.NEXT_PUBLIC_URL}`;
      default:
        return '/';
    }
  };

  return (
    <div className="grid grid-cols-2 tablet:grid-cols-4 gap-4 w-full">
      {loginMethodArr.map(item => (
        <Link
          key={item.id}
          href={handleLogin(item.method)}
          className="group transform transition-all duration-300 hover:-translate-y-2 hover:scale-105"
        >
          <div className="flex flex-col items-center p-4 bg-white/90 backdrop-blur-md rounded-3xl border border-gray-200 shadow-lg hover:shadow-2xl hover:border-blue-200 space-y-3 transition-all">
            <div className="p-3 bg-gray-50 rounded-full">{item.image}</div>
            <span className="text-sm text-gray-700 font-semibold opacity-80 group-hover:opacity-100 group-hover:text-blue-600">
              {item.method}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

const ClientButtonGroup = dynamic(() => Promise.resolve(ButtonGroup), {
  ssr: false,
});

const Home = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-white">
      <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-[0.03]" />
      <div className="absolute inset-0 backdrop-blur-[150px]" />

      <div className="container mx-auto px-4 py-8 tablet:py-16 min-h-screen flex flex-col justify-center relative">
        <div className="max-w-5xl mx-auto w-full">
          <div className="grid tablet:grid-cols-2 gap-16 items-center">
            <div className="space-y-10 order-2 tablet:order-1">
              <div className="space-y-6">
                <Shared.LogmeText
                  type="caption"
                  fontStyle="bold"
                  className="text-3xl tablet:text-4xl desktop:text-5xl text-gray-900 leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
                >
                  최고의 개발자 <br />
                  블로깅 플랫폼
                  <br /> 마크다운으로 시작하세요
                </Shared.LogmeText>

                <p className="text-gray-600 text-xl leading-relaxed">
                  지식을 공유하고, 개발자들과 소통하며,
                  <br className="hidden tablet:block" /> 나만의 브랜드를
                  만들어보세요.
                </p>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-gray-800 font-semibold mb-6 text-xl">
                    로그인하기
                  </h3>
                  <ClientButtonGroup />
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                  <span className="text-sm text-gray-500 font-medium">
                    또는
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                </div>

                <div className="group cursor-pointer">
                  <div className="p-6 bg-white/90 backdrop-blur-md border border-gray-200 rounded-3xl shadow-lg transition-all duration-300 hover:border-blue-200 hover:shadow-2xl hover:bg-blue-50/50 transform hover:-translate-y-2">
                    <Shared.LogmeText
                      type="caption"
                      fontStyle="bold"
                      className="text-gray-800 group-hover:text-blue-700 text-xl"
                    >
                      게스트 모드 시작하기
                      <br />
                      <span className="text-base text-gray-500 group-hover:text-blue-600">
                        Start with Guest Mode
                      </span>
                    </Shared.LogmeText>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center order-1 tablet:order-2">
              <div className="w-full max-w-lg relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl group-hover:opacity-80 transition-opacity duration-500" />
                <div className="relative z-10 transform transition-transform duration-500 group-hover:scale-105">
                  <Shared.LogmeIcon.NewLogo
                    alt={'logo'}
                    width={300}
                    height={300}
                    cn="w-full h-auto drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
