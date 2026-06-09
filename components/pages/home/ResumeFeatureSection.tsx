import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const FEATURES = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    label: '실시간 미리보기',
    desc: '작성하는 즉시 A4 이력서로 확인',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
    label: 'PDF 저장',
    desc: '원클릭으로 이력서 PDF 다운로드',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
      </svg>
    ),
    label: '자동 저장',
    desc: '작성 내용이 자동으로 보관',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h7" />
      </svg>
    ),
    label: '섹션 자유 배치',
    desc: '드래그로 경력·프로젝트 순서 조정',
  },
];

const ResumeFeatureSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-60px' }}
      className="overflow-hidden rounded-3xl border border-ftBlue/20 bg-gradient-to-br from-ftBlue/[0.06] via-white to-white px-6 py-10 shadow-sm tablet:px-10 tablet:py-12"
    >
      <div className="flex flex-col gap-8 tablet:flex-row tablet:items-center tablet:gap-12">
        {/* 좌측: 텍스트 + CTA */}
        <div className="flex-1 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-ftBlue/10 px-3 py-1 text-xs font-semibold text-ftBlue">
              <span className="h-1.5 w-1.5 rounded-full bg-ftBlue" />
              NEW · 이력서 빌더
            </span>
            <h2 className="text-2xl font-extrabold leading-tight text-ftBlack tablet:text-3xl break-keep">
              개발자 이력서,
              <br />
              <span className="bg-gradient-to-r from-ftBlue to-[#1c3f7a] bg-clip-text text-transparent">
                LOGME로 무료로 만들어요
              </span>
            </h2>
            <p className="text-sm leading-relaxed text-ftGray break-keep">
              경력·프로젝트·기술스택을 입력하면 깔끔한 A4 이력서가 완성됩니다.
              <br className="hidden tablet:block" />
              실시간 미리보기와 PDF 저장까지 모두 무료로 제공합니다.
            </p>
          </div>

          {/* Feature 태그 */}
          <div className="grid grid-cols-2 gap-2.5">
            {FEATURES.map(f => (
              <div key={f.label} className="flex items-start gap-2.5 rounded-xl border border-ftBlue/10 bg-white px-3.5 py-3 shadow-sm">
                <span className="mt-0.5 flex-shrink-0 text-ftBlue">{f.icon}</span>
                <div>
                  <p className="text-xs font-bold text-ftBlack">{f.label}</p>
                  <p className="text-[11px] leading-tight text-ftGray">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/resume"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-ftBlue px-6 py-3 text-sm font-bold text-white shadow-md shadow-ftBlue/25 transition-all hover:scale-105 hover:bg-[#1c3f7a]"
          >
            이력서 무료 작성하기
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {/* 우측: 이력서 미리보기 카드 */}
        <div className="flex-shrink-0 w-full tablet:w-[300px]">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 overflow-hidden">
            {/* 카드 상단 바 */}
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-4 py-2.5">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-300" />
              </div>
              <span className="text-[10px] text-slate-400">이력서 미리보기</span>
            </div>
            {/* 이력서 모형 */}
            <div className="p-5 space-y-3">
              {/* 헤더 영역 */}
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-1.5">
                  <div className="h-4 w-24 rounded-md bg-slate-800" />
                  <div className="h-2.5 w-32 rounded-md bg-slate-300" />
                  <div className="mt-1 space-y-1">
                    <div className="h-2 w-36 rounded bg-slate-200" />
                    <div className="h-2 w-28 rounded bg-slate-200" />
                  </div>
                </div>
                <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-slate-200" />
              </div>
              {/* 구분선 */}
              <div className="h-px bg-slate-200" />
              {/* 섹션 */}
              {['경력', '프로젝트', '기술 스택'].map(label => (
                <div key={label} className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-ftBlue">{label}</span>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>
                  <div className="space-y-1 pl-1">
                    <div className="h-2 w-full rounded bg-slate-100" />
                    <div className="h-2 w-4/5 rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ResumeFeatureSection;
