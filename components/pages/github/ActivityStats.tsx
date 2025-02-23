/* eslint-disable @next/next/no-img-element */
import React from 'react';

interface ActivityStatsProps {
  githubId: string;
}

export const StreakStats = ({ githubId }: ActivityStatsProps) => (
  <div className="bg-white/5 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
    <h2 className="text-xl font-semibold text-ftBlue mb-2">연속 기여 현황</h2>
    <p className="text-gray-400 text-sm mb-3">
      현재 연속 기여일수와 최장 연속 기여 기록을 보여줍니다.
    </p>
    <img
      src={`https://github-readme-streak-stats.herokuapp.com/?user=${githubId}&theme=tokyonight&hide_border=true`}
      alt={`${githubId}의 GitHub 연속 기여 현황`}
      className="w-full h-auto rounded-md"
    />
  </div>
);

export const TrophyStats = ({ githubId }: ActivityStatsProps) => (
  <div className="bg-white/5 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
    <h2 className="text-xl font-semibold text-ftBlue mb-2">최근 활동</h2>
    <p className="text-gray-400 text-sm mb-3">
      GitHub에서의 최근 활동 트로피입니다.
    </p>
    <img
      src={`https://github-profile-trophy.vercel.app/?username=${githubId}&theme=tokyonight&column=4&margin-w=15&margin-h=15&no-frame=true`}
      alt={`${githubId}의 GitHub 트로피`}
      className="w-full"
    />
  </div>
);
