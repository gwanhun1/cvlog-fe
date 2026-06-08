import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import useIsLogin from 'hooks/useIsLogin';
import { useDraftResume } from 'hooks/useDraftResume';
import DraftResumeModal from 'components/Shared/DraftResumeModal';

const VIDEO_LABELS = ['마크다운 에디터', '이미지 업로드', 'Masonry 탐색', '태그 폴더'];

const Header = () => {
  const videoSources = useMemo(
    () => ['/videos/1st.mp4', '/videos/2nd.mp4', '/videos/3rd.mp4', '/videos/4th.mp4'],
    [],
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { isAuthenticated } = useIsLogin();
  const { handleNewArticle, showModal, draftInfo, handleResume, handleFresh, handleClose } =
    useDraftResume();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = 4;
    video.play().catch(() => undefined);
  }, [currentIndex]);

  const handleEnded = () => setCurrentIndex(prev => (prev + 1) % videoSources.length);
  const handleLoadedMetadata = () => {
    if (videoRef.current) videoRef.current.playbackRate = 4;
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-ftBlue/15 bg-white px-8 py-12 shadow-lg shadow-ftBlue/8 tablet:px-14 tablet:py-16">
      {/* 배경 장식 */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br from-ftBlue/15 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-gradient-to-tr from-ftBlue/10 to-transparent blur-2xl" />

      <div className="relative flex flex-col items-center gap-12 tablet:flex-row tablet:items-center tablet:justify-between">

        {/* ── 텍스트 ── */}
        <div className="flex flex-col items-center gap-6 text-center tablet:items-start tablet:text-left tablet:max-w-[440px]">
          {/* 플랫폼 레이블 */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-ftBlue/25 bg-ftBlue/5 px-3 py-1 text-xs font-semibold tracking-wide text-ftBlue">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ftBlue" />
            개발자 마크다운 블로그
          </span>

          {/* 헤드라인 */}
          <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-ftBlack tablet:text-5xl">
            Write.{' '}
            <span className="bg-gradient-to-r from-ftBlue to-[#1c3f7a] bg-clip-text text-transparent">
              Preview.
            </span>
            <br />
            Publish.
          </h1>

          {/* 서브카피 */}
          <p className="max-w-sm text-sm leading-relaxed text-ftGray tablet:text-base">
            마크다운으로 쓰고, 실시간으로 확인하며,
            <br className="hidden tablet:block" />
            깔끔하게 퍼블리시하세요.
          </p>

          {/* CTA */}
          <div className="flex flex-wrap items-center justify-center gap-3 tablet:justify-start">
            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={handleNewArticle}
                  className="inline-flex items-center gap-2 rounded-xl bg-ftBlue px-6 py-3 text-sm font-bold text-white shadow-md shadow-ftBlue/30 transition-all duration-200 hover:scale-105 hover:bg-[#1c3f7a]"
                >
                  글 작성하기
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <Link
                  href="/article"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-ftBlue/25 bg-white px-6 py-3 text-sm font-bold text-ftBlue transition-all duration-200 hover:scale-105 hover:bg-ftBlue/5"
                >
                  게시물 보기
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/article"
                  className="inline-flex items-center gap-2 rounded-xl bg-ftBlue px-6 py-3 text-sm font-bold text-white shadow-md shadow-ftBlue/30 transition-all duration-200 hover:scale-105 hover:bg-[#1c3f7a]"
                >
                  블로그 둘러보기
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-ftBlue/25 bg-white px-6 py-3 text-sm font-bold text-ftBlue transition-all duration-200 hover:scale-105 hover:bg-ftBlue/5"
                >
                  로그인하기
                </Link>
              </>
            )}
          </div>

          {/* 기능 태그 라인 */}
          <p className="text-xs text-gray-400">
            마크다운 에디터&nbsp;·&nbsp;실시간 프리뷰&nbsp;·&nbsp;이미지 드롭&nbsp;·&nbsp;태그 관리
          </p>
        </div>

        {/* ── 브라우저 프레임 비디오 ── */}
        <div className="w-full flex-shrink-0 tablet:w-[460px]">
          {/* 브라우저 크롬 */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-2xl shadow-slate-300/40">
            {/* 상단 바 */}
            <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-100 px-4 py-2.5">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <div className="flex flex-1 items-center gap-2 rounded-md bg-white px-3 py-1 text-xs text-gray-400 shadow-inner">
                <svg className="h-3 w-3 flex-shrink-0 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
                logme.io
              </div>
            </div>

            {/* 비디오 */}
            <div className="relative bg-slate-900">
              <video
                key={videoSources[currentIndex]}
                ref={videoRef}
                src={videoSources[currentIndex]}
                autoPlay
                muted
                playsInline
                preload="metadata"
                onEnded={handleEnded}
                onLoadedMetadata={handleLoadedMetadata}
                className="h-[240px] w-full object-cover tablet:h-[280px]"
              />
              {/* 현재 기능 레이블 */}
              <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 rounded-lg bg-black/50 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                {VIDEO_LABELS[currentIndex]}
              </div>
              {/* 도트 */}
              <div className="absolute bottom-3 right-3 z-10 flex gap-1">
                {videoSources.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === currentIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/40'
                    }`}
                    aria-label={VIDEO_LABELS[i]}
                  />
                ))}
              </div>
            </div>

            {/* 하단 탭 */}
            <div className="flex border-t border-slate-200 bg-slate-50">
              {VIDEO_LABELS.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setCurrentIndex(i)}
                  className={`flex-1 px-2 py-2 text-[10px] font-medium transition-colors duration-150 ${
                    i === currentIndex
                      ? 'bg-white text-ftBlue border-t-2 border-ftBlue -mt-px'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
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

export default Header;
