import React, { useEffect, useMemo, useRef, useState } from 'react';

const Header = () => {
  const videoSources = useMemo(
    () => [
      '/videos/1st.mp4',
      '/videos/2nd.mp4',
      '/videos/3rd.mp4',
      '/videos/4th.mp4',
    ],
    []
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = 4;
    video.play().catch(() => undefined);
  }, [currentIndex]);

  const handleEnded = () => {
    setCurrentIndex(prev => (prev + 1) % videoSources.length);
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = 4;
  };

  return (
    <section className="overflow-hidden relative p-8 bg-gradient-to-br from-white via-white rounded-3xl border shadow-lg backdrop-blur border-ftBlue/20 shadow-ftBlue/10 tablet:p-10">
      {/* 배경 장식 요소 */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br to-transparent rounded-full blur-3xl from-ftBlue/20" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr to-transparent rounded-full blur-2xl from-ftBlue/15" />
      <div className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full blur-2xl bg-ftBlue/10" />

      <div className="flex relative flex-col gap-8 tablet:flex-row tablet:items-center tablet:justify-between">
        <div className="space-y-5 text-center tablet:text-left">
          <h1 className="text-4xl font-extrabold tablet:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-ftBlue via-[#2a5298] to-[#123673] drop-shadow-sm">
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
        <div className="flex justify-center tablet:justify-end w-full tablet:w-[420px]">
          <div className="overflow-hidden relative w-full rounded-2xl border-2 shadow-xl border-ftBlue/20 shadow-ftBlue/15">
            <div className="absolute inset-0 z-10 bg-gradient-to-t via-transparent to-transparent pointer-events-none from-ftBlue/20" />
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
              className="w-full h-[260px] tablet:h-[300px] object-cover"
            />
            <div className="absolute left-4 bottom-4 z-20 flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-white rounded-full bg-gradient-to-r from-ftBlue to-[#1c3f7a] shadow-md">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Preview Demo
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
