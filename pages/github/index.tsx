import { useState } from 'react';
import { SkeletonLayout } from '../../components/pages/github/Skeleton';
import ContributionChart from '../../components/pages/github/ContributionChart';
import {
  GithubLanguagesCard,
  GithubStatsCard,
} from '../../components/pages/github/StatsSection';
import {
  StreakStats,
  TrophyStats,
} from '../../components/pages/github/ActivityStats';
import RepoHighlights from '../../components/pages/github/RepoHighlights';
import ProfileOverview from '../../components/pages/github/ProfileOverview';
import RelatedPostsCard from '../../components/pages/github/RelatedPostsCard';
import { useStore } from 'service/store/useStore';
import { NextPage } from 'next';
import AuthGuard from 'components/Shared/common/AuthGuard';

const Github: NextPage = () => {
  const userInfo = useStore(state => state.userIdAtom);
  // ProfileOverview에서 상위로 끌어올린 top language 목록
  const [topLanguages, setTopLanguages] = useState<string[]>([]);

  if (!userInfo) {
    return (
      <AuthGuard>
        <SkeletonLayout />
      </AuthGuard>
    );
  }

  if (!userInfo?.github_id) {
    return (
      <AuthGuard>
        <div className="flex flex-col items-center justify-center min-h-[90vh] text-center text-gray-400">
          <p className="mb-2 text-2xl font-semibold">GitHub 연동 정보 없음 😢</p>
          <p className="text-lg">GitHub 계정과 연결된 정보가 없습니다.</p>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-[90vh]">
        <div className="px-4 pt-5 pb-10 mx-auto space-y-5 max-w-6xl tablet:px-6 desktop:px-8">

          {/* 프로필 */}
          <ProfileOverview
            githubId={userInfo.github_id}
            fallbackName={userInfo.name}
            fallbackAvatar={userInfo.profile_image}
            onTopLanguagesLoaded={setTopLanguages}
          />

          <div className="grid grid-cols-1 gap-4 tablet:grid-cols-3">
            {/* 좌측 (2칸) */}
            <div className="space-y-4 tablet:col-span-2">
              <ContributionChart githubId={userInfo.github_id} />
              <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 items-stretch">
                <div className="flex flex-col">
                  <GithubStatsCard githubId={userInfo.github_id} />
                </div>
                <div className="flex flex-col">
                  <StreakStats githubId={userInfo.github_id} />
                </div>
              </div>
              {/* 활동 타임라인 */}
              <TrophyStats githubId={userInfo.github_id} />
            </div>

            {/* 우측 (1칸) */}
            <div className="space-y-4">
              <RepoHighlights githubId={userInfo.github_id} />
              <GithubLanguagesCard githubId={userInfo.github_id} />
              {/* LOGME 연관 글 */}
              <RelatedPostsCard
                userId={userInfo.id}
                topLanguages={topLanguages}
              />
            </div>
          </div>

        </div>
      </div>
    </AuthGuard>
  );
};

export default Github;
