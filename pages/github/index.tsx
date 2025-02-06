import React from 'react';
import { useGetUserInfo } from 'service/hooks/Login';

// 스켈레톤 카드 컴포넌트 (반복 사용)
const SkeletonCard = () => (
  <div className="w-full p-6 bg-white/5 rounded-lg shadow-md animate-pulse">
    <div className="space-y-4">
      <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
      <div className="h-40 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
);

// 스켈레톤 UI 컴포넌트
const SkeletonChart = SkeletonCard;
const SkeletonStats = SkeletonCard;
const SkeletonLanguages = SkeletonCard;
const SkeletonStreak = SkeletonCard;
const SkeletonTrophy = SkeletonCard;

const Github = () => {
  const { data: info, isLoading } = useGetUserInfo();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-[90vh]">
        <div className="max-w-4xl mx-auto space-y-6">
          <SkeletonChart />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SkeletonStats />
            <SkeletonLanguages />
          </div>
          <SkeletonStreak />
          <SkeletonTrophy />
        </div>
      </div>
    );
  }

  if (!info?.github_id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[90vh] text-center text-gray-400">
        <p className="text-2xl font-semibold mb-2">GitHub 연동 정보 없음 😢</p>
        <p className="text-lg">GitHub 계정과 연결된 정보가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-[90vh]">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* GitHub Contributions Chart */}
        <div className="bg-white/5 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-ftBlue mb-2">
            연간 기여 그래프
          </h2>
          <p className="text-gray-400 text-sm mb-3">
            1년 동안의 GitHub 활동을 한눈에 확인할 수 있습니다.
          </p>
          <img
            src={`https://ghchart.rshah.org/2657A6/${info.github_id}`}
            alt={`${info.github_id}의 GitHub 연간 기여 그래프`}
            className="w-full rounded-md"
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* GitHub README Stats */}
          <div className="bg-white/5 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
            <h2 className="text-xl font-semibold text-ftBlue mb-2">
              GitHub 통계
            </h2>
            <p className="text-gray-400 text-sm mb-3">
              총 커밋, 기여도, PR, 이슈 등 전반적인 GitHub 활동 통계입니다.
            </p>
            <div className="flex-grow flex items-center">
              <img
                src={`https://github-readme-stats.vercel.app/api?username=${info.github_id}&show_icons=true&theme=tokyonight&hide_border=true`}
                alt={`${info.github_id}의 GitHub 통계`}
                className="w-full"
              />
            </div>
          </div>

          {/* GitHub Top Languages */}
          <div className="bg-white/5 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
            <h2 className="text-xl font-semibold text-ftBlue mb-2">
              주요 사용 언어
            </h2>
            <p className="text-gray-400 text-sm mb-3">
              GitHub 저장소에서 가장 많이 사용된 프로그래밍 언어 통계입니다.
            </p>
            <div className="flex-grow flex items-center">
              <img
                src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${info.github_id}&layout=compact&theme=tokyonight&hide_border=true`}
                alt={`${info.github_id}의 GitHub 사용 언어 통계`}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* GitHub Streak Stats */}
        <div className="bg-white/5 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-ftBlue mb-2">
            연속 기여 현황
          </h2>
          <p className="text-gray-400 text-sm mb-3">
            현재 연속 기여일수와 최장 연속 기여 기록을 보여줍니다.
          </p>
          <img
            src={`https://github-readme-streak-stats.herokuapp.com/?user=${info.github_id}&theme=tokyonight&hide_border=true`}
            alt={`${info.github_id}의 GitHub 연속 기여 현황`}
            className="w-full h-auto rounded-md"
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white/5 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-ftBlue mb-2">최근 활동</h2>
          <p className="text-gray-400 text-sm mb-3">
            GitHub에서의 최근 활동 트로피입니다.
          </p>
          <img
            src={`https://github-profile-trophy.vercel.app/?username=${info.github_id}&theme=tokyonight&column=4&margin-w=15&margin-h=15&no-frame=true`}
            alt={`${info.github_id}의 GitHub 트로피`}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Github;
