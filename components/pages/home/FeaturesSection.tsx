import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IntroduceData } from './introduce';

interface Props {
  data: IntroduceData[];
}

const TAB_ICONS = [
  // 마크다운 에디터
  <svg key="md" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>,
  // 이미지 업로드
  <svg key="img" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>,
  // Masonry
  <svg key="masonry" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10-3a2 2 0 012-2h2a2 2 0 012 2v5a2 2 0 01-2 2h-2a2 2 0 01-2-2v-5z" />
  </svg>,
  // 태그 폴더
  <svg key="folder" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>,
];

const INTERVAL = 5000;

const FeaturesSection = ({ data }: Props) => {
  const [active, setActive] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % data.length);
      setProgressKey(k => k + 1);
    }, INTERVAL);
  };

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [data.length]);

  const handleTabClick = (i: number) => {
    setActive(i);
    setProgressKey(k => k + 1);
    startTimer();
  };

  const current = data[active];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-60px' }}
      className="overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-50/70 px-6 py-10 shadow-sm tablet:px-10 tablet:py-12"
    >
      {/* 섹션 헤더 */}
      <div className="mb-8 text-center">
        <span className="inline-block rounded-full bg-ftBlue/8 px-3 py-1 text-xs font-semibold text-ftBlue">
          주요 기능
        </span>
        <h2 className="mt-2 text-2xl font-extrabold text-ftBlack tablet:text-3xl">
          개발 블로깅의 모든 것
        </h2>
        <p className="mt-1.5 text-sm text-ftGray">
          LOGME가 지원하는 핵심 기능들을 확인해보세요.
        </p>
      </div>

      <div className="flex flex-col gap-6 tablet:flex-row tablet:items-start tablet:gap-8">
        {/* 탭 목록 */}
        <div className="flex gap-2 overflow-x-auto pb-1 tablet:flex-col tablet:w-52 tablet:flex-shrink-0 tablet:gap-2 tablet:pb-0">
          {data.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleTabClick(i)}
              className={`relative flex-shrink-0 flex items-center gap-2.5 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all duration-200 tablet:w-full ${
                i === active
                  ? 'bg-white text-ftBlue shadow-md shadow-ftBlue/10'
                  : 'text-ftGray hover:bg-white/60 hover:text-ftBlack'
              }`}
            >
              <span className={i === active ? 'text-ftBlue' : 'text-gray-400'}>
                {TAB_ICONS[i]}
              </span>
              <span className="leading-snug break-keep">{item.title}</span>

              {/* 진행 바 (활성 탭만) */}
              {i === active && (
                <span className="absolute bottom-0 left-0 h-0.5 rounded-full bg-ftBlue/30 w-full overflow-hidden">
                  <span
                    key={progressKey}
                    className="tab-progress-bar absolute inset-y-0 left-0 rounded-full bg-ftBlue"
                  />
                </span>
              )}
            </button>
          ))}
        </div>

        {/* 콘텐츠 패널 */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex flex-col gap-5 tablet:flex-row tablet:items-start tablet:gap-8"
            >
              {/* 비디오 */}
              <div className="overflow-hidden rounded-2xl border border-ftBlue/15 shadow-lg shadow-ftBlue/10 tablet:flex-1">
                <video
                  ref={videoRef}
                  key={current.src}
                  src={current.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="none"
                  className="h-[220px] w-full object-cover tablet:h-[280px]"
                />
              </div>

              {/* 설명 */}
              <div className="flex flex-col gap-4 tablet:w-64 tablet:flex-shrink-0 tablet:pt-2">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-ftBlue text-xs font-bold text-white">
                      {active + 1}
                    </span>
                    <h3 className="text-base font-bold text-ftBlack">{current.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-ftGray break-keep">
                    {current.message}
                  </p>
                </div>

                <div className="rounded-xl border border-ftBlue/12 bg-ftBlue/[0.04] p-3.5">
                  <div className="mb-1 text-xs font-semibold text-ftBlue">💡 Tip</div>
                  <p className="text-xs leading-relaxed text-ftGray break-keep">
                    {current.messageBr}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
};

export default FeaturesSection;
