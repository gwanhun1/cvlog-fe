import React from 'react';
import type { NextPage } from 'next';

const Resume: NextPage = () => {
  return (
    <section className="w-full min-h-[90vh] px-4 tablet:px-6 desktop:px-8 py-16 bg-gradient-to-b from-bgWhite via-white to-[#e7edf5]">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
          {/* 아이콘 */}
          <div className="relative">
            <div className="flex justify-center items-center w-32 h-32 bg-gradient-to-br rounded-full from-ftBlue/20">
              <svg
                className="w-16 h-16 text-ftBlue"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-md animate-pulse">
              개발 중
            </div>
          </div>

          {/* 메인 텍스트 */}
          <div className="space-y-4">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-ftBlue via-[#2a5298] to-[#1c3f7a] tablet:text-4xl">
              Resume 페이지 준비 중
            </h1>
            <p className="mx-auto max-w-md text-base leading-relaxed text-ftGray tablet:text-lg">
              프로젝트, 경력, 스킬을 한눈에 보여줄
              <br />
              리줌 페이지를 열심히 개발하고 있어요.
            </p>
          </div>

          {/* 예정 기능 카드 */}
          <div className="p-6 w-full rounded-3xl border shadow-lg backdrop-blur border-ftBlue/20 bg-white/90 shadow-ftBlue/10 tablet:p-8">
            <h2 className="mb-4 text-lg font-semibold text-ftBlue">
              🚀 예정된 기능
            </h2>
            <div className="grid gap-3 tablet:grid-cols-2">
              <div className="flex gap-3 items-center p-3 rounded-xl border bg-bgWhite border-ftBlue/10">
                <span className="text-lg">📋</span>
                <span className="text-sm text-ftGray">타임라인 경력 정리</span>
              </div>
              <div className="flex gap-3 items-center p-3 rounded-xl border bg-bgWhite border-ftBlue/10">
                <span className="text-lg">💼</span>
                <span className="text-sm text-ftGray">프로젝트 카드</span>
              </div>
              <div className="flex gap-3 items-center p-3 rounded-xl border bg-bgWhite border-ftBlue/10">
                <span className="text-lg">📄</span>
                <span className="text-sm text-ftGray">PDF 내보내기</span>
              </div>
              <div className="flex gap-3 items-center p-3 rounded-xl border bg-bgWhite border-ftBlue/10">
                <span className="text-lg">🔗</span>
                <span className="text-sm text-ftGray">공유 링크 생성</span>
              </div>
            </div>
          </div>

          {/* 돌아가기 버튼 */}
          <a
            href="/"
            className="inline-flex gap-2 items-center px-6 py-3 text-sm font-semibold bg-white rounded-xl border-2 transition-all duration-300 text-ftBlue border-ftBlue/30 hover:bg-ftBlue hover:text-white"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            홈으로 돌아가기
          </a>
        </div>
      </div>
    </section>
  );
};

export default Resume;
