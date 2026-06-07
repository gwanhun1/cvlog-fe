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
    <div className="min-h-screen flex flex-col justify-center items-center px-4 gap-6">
      <Shared.LogmeIcon.SymbolLogoIcon
        alt={'logo'}
        width={220}
        height={220}
      />

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-7">
        <div className="flex flex-col items-center gap-1 mb-6">
          <div className="text-gray-900 font-semibold text-xl">로그인</div>
          <div className="text-gray-400 text-sm">Logme에 오신 것을 환영합니다</div>
        </div>

        <div className="flex flex-col gap-3">
          <ClientButtonGroup />

          <div className="flex items-center gap-3 my-1">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">또는</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <GuestButton />
        </div>

        <div className="text-gray-400 text-xs text-center mt-6 leading-relaxed text-balance">
          로그인하면 Logme의 이용약관과 개인정보 처리방침에 동의하게 됩니다.
        </div>
      </div>

      <div className="text-gray-400 text-xs">
        © 2025 Logme. All rights reserved.
      </div>
    </div>
  );
};

export default Login;
