import React from 'react';
import dynamic from 'next/dynamic';
import LoginButtonGroup from 'components/pages/dashboard/LoginButtonGroup';
import GuestButton from 'components/pages/dashboard/GuestButton';
import * as Shared from 'components/Shared';

const ClientButtonGroup = dynamic(() => Promise.resolve(LoginButtonGroup), {
  ssr: false,
});

const Login = () => {
  return (
    <div className="min-h-screen  flex flex-col justify-center items-center px-4">
      <div className="flex justify-center mb-4">
        <Shared.LogmeIcon.SymbolLogoIcon
          alt={'logo'}
          width={300}
          height={300}
        />
      </div>
      <div className="w-full max-w-md space-y-10 bg-white p-8 rounded-2xl border border-gray-200 border-t-4 border-t-[#2657A6]">
        <div className="w-full flex flex-col items-center space-y-6">
          <div className=" flex flex-col items-center space-y-1">
            <h3 className="text-gray-800 font-semibold text-2xl">로그인</h3>
            <h3 className="text-gray-500 text-sm">
              Logme에 오신 것을 환영합니다
            </h3>
          </div>
          <ClientButtonGroup />

          <div className="flex items-center w-full ">
            <div className="h-px flex-1 bg-gray-300"></div>
            <span className="px-3 text-sm text-gray-400 font-medium">또는</span>
            <div className="h-px flex-1 bg-gray-300"></div>
          </div>

          <GuestButton />
        </div>
        <div className="text-gray-500 text-xs mt-5 text-center">
          로그인하면 Logme의 <br />
          이용약관과 개인정보 처리방침에 동의하게 됩니다.
        </div>
      </div>
      <div className="text-gray-500 text-sm mt-5">
        © 2024 Logme. All rights reserved.
      </div>
    </div>
  );
};

export default Login;
