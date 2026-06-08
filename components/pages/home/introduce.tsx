import React, { memo, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export interface IntroduceProps {
  Element: IntroduceData;
}

export interface IntroduceData {
  id: number;
  src: string;
  title: string;
  message: string;
  messageBr: string;
}

const STEP_COLORS = [
  'from-ftBlue to-[#1c3f7a]',
  'from-[#1c3f7a] to-[#0f2654]',
  'from-[#2a5298] to-ftBlue',
  'from-[#1a3a6e] to-[#2657A6]',
];

const Introduce = memo(({ Element }: { Element: IntroduceData }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const isEven = Element.id % 2 === 0;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) video.play();
          else video.pause();
        });
      },
      { threshold: 0.3 },
    );
    observer.observe(video);
    return () => observer.unobserve(video);
  }, []);

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-60px' }}
      className={`overflow-hidden relative p-6 rounded-3xl border shadow-md backdrop-blur tablet:p-8 ${
        isEven
          ? 'bg-gradient-to-br from-white to-slate-50/60 border-ftBlue/15 shadow-ftBlue/8'
          : 'bg-gradient-to-br from-slate-50/80 via-white to-white border-slate-200/80 shadow-slate-200/60'
      }`}
    >
      {/* 배경 orb */}
      <div
        className={`absolute w-36 h-36 rounded-full blur-3xl pointer-events-none ${
          isEven
            ? '-top-16 -right-16 bg-gradient-to-br from-ftBlue/12 to-transparent'
            : '-bottom-16 -left-16 bg-gradient-to-tr from-ftBlue/10 to-transparent'
        }`}
      />

      <div
        className={`flex flex-col ${
          isEven ? 'tablet:flex-row' : 'tablet:flex-row-reverse'
        } gap-6 tablet:gap-10 items-center`}
      >
        {/* 비디오 */}
        <motion.div
          className="relative w-full tablet:w-3/5"
          initial={{ opacity: 0, x: isEven ? -20 : 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="overflow-hidden relative rounded-2xl border-2 shadow-xl border-ftBlue/20 shadow-ftBlue/10 group">
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 pointer-events-none group-hover:opacity-100" />
            <video
              ref={videoRef}
              src={Element.src}
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              className="w-full h-auto min-h-[240px] tablet:min-h-[340px] object-cover"
            />
          </div>
          {/* Step 뱃지 */}
          <div
            className={`absolute -bottom-3 ${isEven ? '-right-3' : '-left-3'} px-3 py-1.5 text-xs font-bold text-white rounded-full bg-gradient-to-r ${STEP_COLORS[Element.id]} shadow-md z-20`}
          >
            Step {Element.id + 1}
          </div>
        </motion.div>

        {/* 텍스트 */}
        <motion.div
          className="space-y-4 w-full tablet:w-2/5"
          initial={{ opacity: 0, x: isEven ? 20 : -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {/* 번호 + 제목 */}
          <div className="flex gap-3 items-start">
            <div
              className={`flex-shrink-0 flex justify-center items-center w-10 h-10 text-sm font-bold text-white rounded-xl bg-gradient-to-br ${STEP_COLORS[Element.id]} shadow-sm`}
            >
              {Element.id + 1}
            </div>
            <h2 className="text-lg font-bold text-ftBlue tablet:text-xl leading-snug break-keep pt-1">
              {Element.title}
            </h2>
          </div>

          {/* 본문 */}
          <p className="pl-[52px] text-sm leading-relaxed tablet:text-base text-ftGray break-keep">
            {Element.message}
          </p>

          {/* 팁 박스 */}
          <div className="ml-[52px] hidden tablet:block">
            <div className="flex gap-2.5 items-start p-4 rounded-xl border border-ftBlue/12 bg-ftBlue/[0.04]">
              <span className="text-base leading-none mt-0.5 flex-shrink-0">💡</span>
              <p className="text-xs leading-relaxed text-ftGray break-keep">
                {Element.messageBr}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
});

Introduce.displayName = 'Introduce';

export default Introduce;
