import React from 'react';
import { SkeletonLayout } from '../../components/pages/github/Skeleton';
import ContributionChart from '../../components/pages/github/ContributionChart';
import StatsSection from '../../components/pages/github/StatsSection';
import {
  StreakStats,
  TrophyStats,
} from '../../components/pages/github/ActivityStats';
import { useRecoilValue } from 'recoil';
import { userIdAtom } from 'service/atoms/atoms';

const Github = () => {
  const userInfo = useRecoilValue(userIdAtom);

  if (!userInfo) {
    return <SkeletonLayout />;
  }
  console.log(userInfo);

  if (!userInfo?.github_id) {
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
        <ContributionChart githubId={userInfo.github_id} />
        <StatsSection githubId={userInfo.github_id} />
        <StreakStats githubId={userInfo.github_id} />
        <TrophyStats githubId={userInfo.github_id} />
      </div>
    </div>
  );
};

export default Github;
