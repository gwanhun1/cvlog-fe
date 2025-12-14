import React, { memo, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

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

const Introduce = memo(({ Element }: { Element: IntroduceData }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 1],
    [0.3, 1, 1, 0.8]
  );

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && video) {
            video.play();
          } else if (video) {
            video.pause();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (video) {
      observer.observe(video);
    }

    return () => {
      if (video) observer.unobserve(video);
    };
  }, []);

  const isEven = Element.id % 2 === 0;

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-50px' }}
      className="overflow-hidden relative p-6 bg-gradient-to-br from-white via-white rounded-3xl border shadow-lg backdrop-blur border-ftBlue/20 to-ftBlue/5 shadow-ftBlue/10 tablet:p-8"
    >
      {/* 배경 장식 */}
      <div
        className={`absolute ${
          isEven ? '-top-16 -right-16' : '-top-16 -left-16'
        } w-32 h-32 rounded-full bg-gradient-to-br from-ftBlue/15 to-transparent blur-2xl`}
      />

      <div
        className={`flex flex-col ${
          isEven ? 'tablet:flex-row' : 'tablet:flex-row-reverse'
        } gap-6 tablet:gap-10 items-center`}
      >
        <motion.div
          style={{ y: isMobile ? 0 : y }}
          className="relative w-full tablet:w-3/5"
        >
          <div className="overflow-hidden relative rounded-2xl border-2 shadow-xl border-ftBlue/20 shadow-ftBlue/15 group">
            <div className="absolute inset-0 z-10 bg-gradient-to-t via-transparent to-transparent opacity-0 transition-opacity duration-500 pointer-events-none from-ftBlue/20 group-hover:opacity-100" />
            <motion.video
              ref={videoRef}
              src={Element.src}
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              className="w-full h-auto min-h-[280px] tablet:min-h-[380px] object-cover transform transition-transform duration-700 group-hover:scale-105 scale-[1.2]"
            />
          </div>
          <div className="absolute -bottom-3 -right-3 px-3 py-1.5 text-xs font-bold text-white rounded-full bg-gradient-to-r from-ftBlue to-[#1c3f7a] shadow-md z-40">
            Step {Element.id + 1}
          </div>
        </motion.div>

        <motion.div
          className="space-y-5 w-full tablet:w-2/5"
          style={{ opacity }}
          initial={{ opacity: 0, x: isEven ? 30 : -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          viewport={{ once: true }}
        >
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 flex justify-center items-center w-12 h-12 text-lg font-bold text-white rounded-xl bg-gradient-to-br from-ftBlue to-[#1c3f7a] shadow-md shadow-ftBlue/30">
              {Element.id + 1}
            </div>
            <h2 className="text-xl font-bold text-ftBlue tablet:text-2xl break-keep">
              {Element.title}
            </h2>
          </div>

          <p className="pl-5 text-sm leading-relaxed border-l-4 tablet:text-base text-ftGray border-ftBlue break-keep">
            {Element.message}
          </p>

          <div className="hidden tablet:block">
            <div className="p-5 text-sm leading-relaxed bg-gradient-to-br to-white rounded-2xl border-2 shadow-sm border-ftBlue/15 from-bgWhite text-ftGray">
              <span className="font-semibold text-ftBlue">💡 Tip: </span>
              {Element.messageBr}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
});

Introduce.displayName = 'Introduce';

export default Introduce;
