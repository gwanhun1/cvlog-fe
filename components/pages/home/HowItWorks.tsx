import React from 'react';
import { motion } from 'framer-motion';

const STEPS = [
  {
    number: '01',
    label: 'Write',
    title: '마크다운으로 작성',
    desc: '강력한 마크다운 에디터에서 코드 블록, 이미지, 표 등을 자유롭게 사용하세요.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7}
          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    color: 'from-ftBlue to-[#1c3f7a]',
    bgLight: 'bg-ftBlue/8',
    textColor: 'text-ftBlue',
  },
  {
    number: '02',
    label: 'Preview',
    title: '실시간으로 확인',
    desc: '작성과 동시에 렌더링된 결과를 프리뷰 화면에서 바로 확인하세요.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    color: 'from-[#2a5298] to-ftBlue',
    bgLight: 'bg-[#2a5298]/8',
    textColor: 'text-[#2a5298]',
  },
  {
    number: '03',
    label: 'Publish',
    title: '퍼블리시',
    desc: '완성된 글을 저장하면 태그와 함께 블로그에 즉시 게시됩니다.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7}
          d="M5 13l4 4L19 7" />
      </svg>
    ),
    color: 'from-[#1c3f7a] to-[#0f2654]',
    bgLight: 'bg-[#1c3f7a]/8',
    textColor: 'text-[#1c3f7a]',
  },
];

const HowItWorks = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-60px' }}
      className="px-2 py-4"
    >
      {/* 섹션 헤더 */}
      <div className="mb-10 text-center">
        <span className="inline-block rounded-full bg-ftBlue/8 px-3 py-1 text-xs font-semibold text-ftBlue">
          사용 방법
        </span>
        <h2 className="mt-2 text-2xl font-extrabold text-ftBlack tablet:text-3xl">
          딱 3단계면 충분해요
        </h2>
        <p className="mt-1.5 text-sm text-ftGray">
          복잡한 설정 없이, 바로 시작할 수 있어요.
        </p>
      </div>

      {/* 스텝 카드 */}
      <div className="relative grid gap-4 tablet:grid-cols-3 tablet:gap-6">
        {/* 연결선 (데스크톱) */}
        <div className="pointer-events-none absolute top-10 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] hidden h-px border-t-2 border-dashed border-ftBlue/20 tablet:block" />

        {STEPS.map((step, i) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.12, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="relative flex flex-col items-start gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
          >
            {/* 번호 + 아이콘 */}
            <div className="flex w-full items-center justify-between">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${step.color} text-white shadow-md`}>
                {step.icon}
              </div>
              <span className={`text-4xl font-extrabold ${step.textColor} opacity-10 leading-none`}>
                {step.number}
              </span>
            </div>

            {/* 텍스트 */}
            <div>
              <div className="mb-0.5 flex items-center gap-2">
                <span className={`text-xs font-bold tracking-widest uppercase ${step.textColor}`}>
                  {step.label}
                </span>
              </div>
              <h3 className="text-base font-bold text-ftBlack">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ftGray break-keep">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default HowItWorks;
