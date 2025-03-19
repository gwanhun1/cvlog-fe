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
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      className="relative my-16 sm:my-24 overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-lg"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:py-24">
        <div
          className={`flex flex-col ${
            isEven ? 'md:flex-row' : 'md:flex-row-reverse'
          } gap-10 lg:gap-16 items-center`}
        >
          <motion.div
            style={{ y: isMobile ? 0 : y }}
            className={`relative w-full md:w-1/2 ${
              isEven ? 'md:pr-4' : 'md:pl-4'
            }`}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-xl group aspect-video">
              <motion.video
                ref={videoRef}
                src={Element.src}
                autoPlay
                loop
                muted
                playsInline
                preload="none"
                className="w-full h-[520px] object-cover transform transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </motion.div>

          <motion.div
            className="w-full md:w-1/2"
            style={{ opacity }}
            initial={{ opacity: 0, x: isEven ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-6">
              <div className="hidden md:block w-8 h-1 bg-ftBlue mr-4"></div>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 text-lg sm:text-xl font-bold text-white rounded-full bg-ftBlue mr-3 shadow-md">
                  {Element.id + 1}
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-ftBlue dark:text-ftBlue">
                  {Element.title}
                </h2>
              </div>
            </div>

            <div className="space-y-6">
              <div className="text-lg sm:text-xl leading-relaxed text-gray-700 dark:text-gray-300 border-l-4 border-ftBlue pl-4">
                {Element.message}
              </div>

              <div className="hidden sm:block">
                <div className="text-base text-gray-600 dark:text-gray-400 leading-relaxed p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  {Element.messageBr}
                </div>
              </div>

              <div className="hidden sm:flex items-center space-x-2 pt-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full bg-ftBlue ${
                      i === 0
                        ? 'opacity-100'
                        : i === 1
                        ? 'opacity-60'
                        : 'opacity-30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
});

Introduce.displayName = 'Introduce';

export default Introduce;
