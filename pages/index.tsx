import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import * as Shared from 'components/Shared';
import LocalStorage from 'public/utils/Localstorage';
import dynamic from 'next/dynamic';

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
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setAccessToken(LocalStorage.getItem('CVtoken'));
  }, []);

  if (!mounted) return null;

  const hadleLogin = (loginMethod: string) => {
    if (accessToken) {
      return '/about';
    }
    switch (loginMethod) {
      case 'Github':
        return `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_ID}&redirect_uri=${process.env.NEXT_PUBLIC_URL}`;
      case 'Google':
        return '/';
      case '네이버':
        return '/';
      case '카카오':
        return '/';
      default:
        return '/';
    }
  };

  return (
    <div className="grid grid-cols-2 tablet:grid-cols-4 gap-4 w-full">
      {loginMethodArr.map((item) => (
        <Link
          key={item.id}
          href={hadleLogin(item.method)}
          className="group"
        >
          <div className="flex flex-col items-center p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:border-blue-200 group-hover:-translate-y-1 group-hover:bg-white">
            <div className="transform transition-transform duration-300 group-hover:scale-110">
              {item.image}
            </div>
            <span className="mt-3 text-sm text-gray-600 font-medium opacity-80 group-hover:opacity-100">
              {item.method}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

// 클라이언트 사이드에서만 렌더링되는 버튼 그룹
const ClientButtonGroup = dynamic(() => Promise.resolve(ButtonGroup), {
  ssr: false,
});

const Home = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-[0.04]" />
      <div className="absolute inset-0 backdrop-blur-[200px]" />

      <div className="container mx-auto px-4 py-8 tablet:py-16 min-h-screen flex flex-col justify-center relative">
        <div className="max-w-5xl mx-auto w-full">
          <div className="grid tablet:grid-cols-2 gap-12 tablet:gap-16 items-center">
            <div className="space-y-8 order-2 tablet:order-1">
              <div className="space-y-6">
                <Shared.LogmeText
                  type="caption"
                  fontStyle="regular"
                  className="text-2xl tablet:text-3xl desktop:text-4xl text-gray-800 leading-relaxed"
                >
                  최고의
                  <br /> 개발자 블로깅 플랫폼
                  <br /> 마크다운으로 시작하세요
                </Shared.LogmeText>

                <p className="text-gray-600 text-lg tablet:text-xl leading-relaxed">
                  지식을 공유하고, 개발자들과 소통하며,
                  <br className="hidden tablet:block" /> 나만의 브랜드를
                  만들어보세요.
                </p>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-gray-700 font-medium mb-6 text-lg">
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

                <Link href="/about" className="inline-block group w-full">
                  <div className="p-5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl transition-all duration-300 hover:border-blue-200 hover:shadow-lg hover:bg-white group-hover:-translate-y-1">
                    <Shared.LogmeText
                      type="caption"
                      fontStyle="bold"
                      className="text-gray-700 group-hover:text-blue-600"
                    >
                      게스트 모드 시작하기
                      <br />
                      <span className="text-sm text-gray-500 group-hover:text-blue-500">
                        Start with Guest Mode
                      </span>
                    </Shared.LogmeText>
                  </div>
                </Link>
              </div>
            </div>

            <div className="flex justify-center order-1 tablet:order-2">
              <div className="w-full max-w-lg transform hover:scale-105 transition-transform duration-500 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-3xl blur-3xl" />
                <Shared.LogmeIcon.NewLogo
                  alt={'logo'}
                  width={500}
                  height={150}
                  cn="w-full h-auto relative z-10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
