import React from 'react';

const Footer = () => {
  return (
    <section className="overflow-hidden relative p-8 bg-gradient-to-br from-white via-white rounded-3xl border shadow-lg backdrop-blur border-ftBlue/20 shadow-ftBlue/10 tablet:p-10">
      {/* 배경 장식 */}
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br to-transparent rounded-full blur-2xl from-ftBlue/20" />
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gradient-to-tl to-transparent rounded-full blur-3xl from-ftBlue/15" />

      <div className="flex relative flex-col items-center space-y-6 text-center">
        <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-ftBlue via-[#2a5298] to-[#1c3f7a] tablet:text-3xl">
          You are now all ready.
        </h2>
        <p className="max-w-md text-base leading-relaxed text-ftGray tablet:text-lg">
          지금 바로 LOGME와 함께 블로그를 시작해보세요.
          <br />
          당신의 개발 여정을 기록하세요.
        </p>
        <a
          href="/article"
          className="group inline-flex items-center gap-3 px-8 py-4 text-base font-bold text-white rounded-2xl bg-gradient-to-r from-ftBlue to-[#1c3f7a] hover:from-[#1c3f7a] hover:to-ftBlue shadow-lg shadow-ftBlue/30 transition-all duration-300 hover:scale-105"
        >
          게시물 보러가기
          <svg
            className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </a>
      </div>
    </section>
  );
};

export default Footer;
