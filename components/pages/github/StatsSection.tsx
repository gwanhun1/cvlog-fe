/* eslint-disable @next/next/no-img-element */
import React from 'react';

interface StatsSectionProps {
  githubId: string;
}

const StatsSection = ({ githubId }: StatsSectionProps) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <div className="bg-white/5 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
      <h2 className="text-xl font-semibold text-ftBlue mb-2">GitHub 통계</h2>
      <p className="text-gray-400 text-sm mb-3">
        총 커밋, 기여도, PR, 이슈 등 전반적인 GitHub 활동 통계입니다.
      </p>
      <div className="flex-grow flex items-center">
        <img
          src={`https://github-readme-stats.vercel.app/api?username=${githubId}&show_icons=true&theme=tokyonight&hide_border=true`}
          alt={`${githubId}의 GitHub 통계`}
          className="w-full"
        />
      </div>
    </div>

    <div className="bg-white/5 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
      <h2 className="text-xl font-semibold text-ftBlue mb-2">주요 사용 언어</h2>
      <p className="text-gray-400 text-sm mb-3">
        GitHub 저장소에서 가장 많이 사용된 프로그래밍 언어 통계입니다.
      </p>
      <div className="flex-grow flex items-center">
        <img
          src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${githubId}&layout=compact&theme=tokyonight&hide_border=true`}
          alt={`${githubId}의 GitHub 사용 언어 통계`}
          className="w-full"
        />
      </div>
    </div>
  </div>
);

export default StatsSection;
