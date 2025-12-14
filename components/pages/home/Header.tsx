import React from 'react';
import * as Shared from 'components/Shared';

const Header = () => {
  return (
    <section className="overflow-hidden relative p-8 bg-gradient-to-br from-white via-white rounded-3xl border shadow-lg backdrop-blur border-ftBlue/20 to-ftBlue/5 shadow-ftBlue/10 tablet:p-10">
      {/* 배경 장식 요소 */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br to-transparent rounded-full blur-3xl from-ftBlue/20" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr to-transparent rounded-full blur-2xl from-ftBlue/15" />
      <div className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full blur-2xl bg-ftBlue/10" />

      <div className="flex relative flex-col gap-8 tablet:flex-row tablet:items-center tablet:justify-between">
        <div className="space-y-5 text-center tablet:text-left">
          <p className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.25em] rounded-full bg-gradient-to-r from-ftBlue to-[#1c3f7a] text-white shadow-md shadow-ftBlue/30">
            ✨ Modern Markdown Blogging
          </p>
          <h1 className="text-4xl font-extrabold tablet:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-ftBlue via-[#2a5298] to-[#1c3f7a] drop-shadow-sm">
            Write. Preview. Publish.
          </h1>
          <p className="text-base leading-relaxed tablet:text-lg text-ftGray">
            개발자를 위한 궁극의 마크다운 블로그 플랫폼.
            <br className="hidden tablet:block" />
            깔끔한 프리뷰와 안정적인 퍼블리시로 작성 흐름을 경험하세요.
          </p>
          <div className="flex flex-wrap gap-3 justify-center tablet:justify-start">
            <span className="inline-flex gap-2 items-center px-4 py-2 text-xs font-semibold rounded-full border-2 shadow-sm text-ftBlue bg-white/80 border-ftBlue/30">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              실시간 프리뷰
            </span>
            <span className="inline-flex gap-2 items-center px-4 py-2 text-xs font-semibold rounded-full border-2 shadow-sm text-ftBlue bg-white/80 border-ftBlue/30">
              🚀 빠른 퍼블리시
            </span>
            <span className="inline-flex gap-2 items-center px-4 py-2 text-xs font-semibold rounded-full border-2 shadow-sm text-ftBlue bg-white/80 border-ftBlue/30">
              📁 GitHub 연동
            </span>
          </div>
        </div>
        <div className="flex justify-center tablet:justify-end">
          <Shared.LogmeIcon.SymbolLogoIcon
            alt="logo"
            width={220}
            height={140}
          />
        </div>
      </div>
    </section>
  );
};

export default Header;
