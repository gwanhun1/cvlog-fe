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
import { useStore } from 'service/store/useStore';
import { NextPage } from 'next';

import AuthGuard from 'components/Shared/common/AuthGuard';

const Github: NextPage = () => {
  const userInfo = useStore(state => state.userIdAtom);

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
          <p className="mb-2 text-2xl font-semibold">
            GitHub 연동 정보 없음 😢
          </p>
          <p className="text-lg">GitHub 계정과 연결된 정보가 없습니다.</p>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-[90vh]">
        <div className="px-4 py-10 mx-auto space-y-5 max-w-6xl tablet:px-6 desktop:px-8">
          <ProfileOverview
            githubId={userInfo.github_id}
            fallbackName={userInfo.name}
            fallbackAvatar={userInfo.profile_image}
          />

          <div className="grid grid-cols-1 gap-4 tablet:grid-cols-3">
            <div className="space-y-4 tablet:col-span-2">
              <ContributionChart githubId={userInfo.github_id} />
              <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
                <div className="min-h-[320px]">
                  <GithubStatsCard githubId={userInfo.github_id} />
                </div>
                <div className="min-h-[320px]">
                  <StreakStats githubId={userInfo.github_id} />
                </div>
              </div>
              <TrophyStats githubId={userInfo.github_id} />
            </div>
            <div className="space-y-4">
              <RepoHighlights githubId={userInfo.github_id} />
              <GithubLanguagesCard githubId={userInfo.github_id} />
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default Github;
