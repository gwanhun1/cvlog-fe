import React from 'react';

const Footer = () => {
  return (
    <section className="overflow-hidden relative p-8 rounded-3xl border backdrop-blur border-ftBlue/20 bg-gradient-to-br from-white via-white to-ftBlue/5 shadow-lg shadow-ftBlue/10 tablet:p-10">
      {/* 배경 장식 */}
      <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-gradient-to-br from-ftBlue/20 to-transparent blur-2xl" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-tl from-ftBlue/15 to-transparent blur-3xl" />

      <div className="relative flex flex-col items-center text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md">
          ✅ Ready to Start
        </div>
        <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-ftBlue via-[#2a5298] to-[#1c3f7a] tablet:text-3xl">
          You are now all ready.
        </h2>
        <p className="text-base leading-relaxed text-ftGray tablet:text-lg max-w-md">
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
