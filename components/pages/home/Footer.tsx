import React from 'react';
import Link from 'next/link';
import useIsLogin from 'hooks/useIsLogin';
import { useDraftResume } from 'hooks/useDraftResume';

const Footer = () => {
  const { isAuthenticated } = useIsLogin();
  const { handleNewArticle } = useDraftResume();

  return (
    <section className="relative overflow-hidden rounded-[16px] bg-ftBlue p-8 shadow-[0_18px_50px_rgba(38,87,166,0.18)] tablet:p-12">
      <div className="flex relative flex-col items-center space-y-6 text-center">
        {/* 아이콘 */}
        <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center">
          <svg
            className="w-7 h-7 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-white tablet:text-3xl">
            지금 바로 시작해보세요
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-white/75 tablet:text-base">
            당신의 개발 여정을 마크다운으로 기록하고,
            <br className="hidden tablet:block" />더 많은 개발자들과 공유하세요.
          </p>
        </div>

        {/* CTA 버튼 */}
        <div className="flex flex-wrap gap-3 justify-center">
          {isAuthenticated ? (
            <>
              <button
                type="button"
                onClick={handleNewArticle}
                className="group inline-flex min-h-[48px] items-center gap-2.5 rounded-[12px] bg-white px-7 text-sm font-bold text-ftBlue transition-[background-color,transform] duration-200 hover:bg-slate-100 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ftBlue"
              >
                글 작성하기
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
              <Link
                href="/article"
                className="inline-flex min-h-[48px] items-center gap-2.5 rounded-[12px] border border-white/40 px-7 text-sm font-bold text-white transition-[background-color,transform] duration-200 hover:bg-white/10 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ftBlue"
              >
                게시물 보기
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="group inline-flex min-h-[48px] items-center gap-2.5 rounded-[12px] bg-white px-7 text-sm font-bold text-ftBlue transition-[background-color,transform] duration-200 hover:bg-slate-100 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ftBlue"
              >
                로그인하고 시작하기
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5"
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
              </Link>
              <Link
                href="/article"
                className="inline-flex min-h-[48px] items-center gap-2.5 rounded-[12px] border border-white/40 px-7 text-sm font-bold text-white transition-[background-color,transform] duration-200 hover:bg-white/10 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ftBlue"
              >
                둘러보기
              </Link>
            </>
          )}
        </div>
      </div>

    </section>
  );
};

export default Footer;
