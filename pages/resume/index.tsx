import React from 'react';
import Link from 'next/link';
import type { NextPage } from 'next';

const Resume: NextPage = () => {
  return (
    <section className="w-full min-h-[90vh] px-4 tablet:px-6 desktop:px-8 py-12 bg-gradient-to-b from-bgWhite via-white to-[#e7edf5]">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
          <div className="relative">
            <div className="flex justify-center items-center w-24 h-24 bg-gradient-to-br rounded-full from-ftBlue/20">
              <svg
                className="w-12 h-12 text-ftBlue"
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
            <div className="absolute -top-2 -right-2 px-4 py-1.5 text-sm font-extrabold text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-md animate-pulse">
              개발 중
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-ftBlue via-[#2a5298] to-[#1c3f7a] tablet:text-4xl">
              Resume 페이지는 준비 중입니다
            </h1>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-ftGray tablet:text-base">
              아직 구체적인 일정이 없어, 완성도 있게 준비되면 공개할게요.
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full max-w-md tablet:flex-row tablet:justify-center">
            <Link href="/">
              <a className="inline-flex justify-center gap-2 items-center px-5 py-2.5 text-sm font-semibold bg-white rounded-xl border-2 transition-all duration-300 text-ftBlue border-ftBlue/30 hover:bg-ftBlue hover:text-white">
                홈으로
                <span aria-hidden>→</span>
              </a>
            </Link>
            <Link href="/article">
              <a className="inline-flex justify-center gap-2 items-center px-5 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-ftBlue to-[#1c3f7a] text-white shadow-lg shadow-ftBlue/20 transition-all duration-300 hover:scale-[1.02]">
                게시물 보러가기
                <span aria-hidden>→</span>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resume;
