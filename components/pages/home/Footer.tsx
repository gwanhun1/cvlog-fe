import React from 'react';
import Link from 'next/link';
import useIsLogin from 'hooks/useIsLogin';
import { useDraftResume } from 'hooks/useDraftResume';
import DraftResumeModal from 'components/Shared/DraftResumeModal';

const Footer = () => {
  const { isAuthenticated } = useIsLogin();
  const { handleNewArticle, showModal, draftInfo, handleResume, handleFresh, handleClose } =
    useDraftResume();

  return (
    <section className="overflow-hidden relative p-8 bg-gradient-to-br from-ftBlue to-[#1c3f7a] rounded-3xl shadow-xl shadow-ftBlue/25 tablet:p-12">
      {/* 배경 장식 */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex relative flex-col items-center space-y-6 text-center">
        {/* 아이콘 */}
        <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-white tablet:text-3xl">
            지금 바로 시작해보세요
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-white/75 tablet:text-base">
            당신의 개발 여정을 마크다운으로 기록하고,
            <br className="hidden tablet:block" />
            더 많은 개발자들과 공유하세요.
          </p>
        </div>

        {/* CTA 버튼 */}
        <div className="flex flex-wrap gap-3 justify-center">
          {isAuthenticated ? (
            <>
              <button
                type="button"
                onClick={handleNewArticle}
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-bold text-ftBlue bg-white rounded-xl hover:bg-white/90 shadow-lg transition-all duration-300 hover:scale-105"
              >
                글 작성하기
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <Link
                href="/article"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-bold text-white rounded-xl border-2 border-white/30 hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                게시물 보기
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-bold text-ftBlue bg-white rounded-xl hover:bg-white/90 shadow-lg transition-all duration-300 hover:scale-105"
              >
                로그인하고 시작하기
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/article"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-bold text-white rounded-xl border-2 border-white/30 hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                둘러보기
              </Link>
            </>
          )}
        </div>
      </div>

      <DraftResumeModal
        isOpen={showModal}
        draftTitle={draftInfo?.title ?? ''}
        onResume={handleResume}
        onFresh={handleFresh}
        onClose={handleClose}
      />
    </section>
  );
};

export default Footer;
