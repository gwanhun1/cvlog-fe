import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import * as Shared from 'components/Shared';
import LoginButtonGroup from 'components/pages/dashboard/LoginButtonGroup';

const ClientButtonGroup = dynamic(() => Promise.resolve(LoginButtonGroup), {
  ssr: false,
});

const Home = () => {
  return (
    <div className="min-h-screen  flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md space-y-10 bg-white p-8 rounded-2xl border border-gray-200">
        <div className="flex justify-center">
          <Shared.LogmeIcon.SymbolLogoIcon
            alt={'logo'}
            width={500}
            height={500}
            // className="drop-shadow-2xl"
          />
        </div>

        <div className="w-full flex flex-col items-center space-y-6">
          <h3 className="text-gray-800 font-semibold text-xl">로그인</h3>
          <ClientButtonGroup />

          <div className="flex items-center w-full ">
            <div className="h-px flex-1 bg-gray-300"></div>
            <span className="px-3 text-sm text-gray-500 font-medium">또는</span>
            <div className="h-px flex-1 bg-gray-300"></div>
          </div>

          <Link href="/about" className="w-full ">
            <div className="p-4 bg-white/90 backdrop-blur-md border border-gray-200 rounded-3xl shadow-lg transition-all duration-300 hover:border-blue-200 hover:shadow-2xl hover:bg-blue-50/50 transform hover:-translate-y-2 text-center">
              <Shared.LogmeText
                type="caption"
                fontStyle="bold"
                className="text-gray-800 hover:text-blue-700 text-lg"
              >
                게스트 모드 시작하기
                <br />
                <span className="text-sm text-gray-500 hover:text-blue-600">
                  Start with Guest Mode
                </span>
              </Shared.LogmeText>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
