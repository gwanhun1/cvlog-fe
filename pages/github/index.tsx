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
import GithubConnectPrompt from 'components/Shared/GithubConnectPrompt';
import { hasCapability } from 'utils/user';

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

  // 미연동 유저에게는 막다른 안내 대신 연동 경로를 준다
  if (!hasCapability(userInfo, 'githubStats') || !userInfo.github_id) {
    return (
      <AuthGuard>
        <GithubConnectPrompt description="GitHub을 연동하면 기여 그래프, 언어 분포, 저장소 하이라이트를 볼 수 있어요." />
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-[90vh]">
        <div className="mx-auto space-y-5">
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
