import Image from 'next/image';
import { SkeletonLayout } from '../../components/pages/github/Skeleton';
import ContributionChart from '../../components/pages/github/ContributionChart';
import StatsSection from '../../components/pages/github/StatsSection';
import {
  StreakStats,
  TrophyStats,
} from '../../components/pages/github/ActivityStats';
import RepoHighlights from '../../components/pages/github/RepoHighlights';
import { useRecoilValue } from 'recoil';
import { userIdAtom } from 'service/atoms/atoms';
import { NextPage } from 'next';

const Github: NextPage = () => {
  const userInfo = useRecoilValue(userIdAtom);

  if (!userInfo) {
    return <SkeletonLayout />;
  }

  if (!userInfo?.github_id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[90vh] text-center text-gray-400">
        <p className="mb-2 text-2xl font-semibold">GitHub 연동 정보 없음 😢</p>
        <p className="text-lg">GitHub 계정과 연결된 정보가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="px-4 py-10 mx-auto space-y-8 max-w-5xl sm:px-6">
        <section className="overflow-hidden relative p-6 rounded-2xl border shadow-xl backdrop-blur border-slate-100 bg-white/90 sm:p-8">
          <div className="absolute inset-0 bg-gradient-to-r via-white pointer-events-none from-blue-50/60 to-slate-50/60" />
          <div className="flex relative flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                GitHub Profile
              </p>
              <h1 className="text-3xl font-bold text-slate-900">
                {userInfo.name || userInfo.github_id}
              </h1>
              <p className="text-sm leading-relaxed text-slate-600">
                활동 히스토리와 주요 저장소를 한눈에 확인하세요.
              </p>
              <div className="inline-flex gap-2 items-center px-3 py-1 text-xs text-blue-700 bg-blue-50 rounded-full border border-blue-100">
                GitHub ID
                <span className="font-semibold">{userInfo.github_id}</span>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              {userInfo.profile_image && (
                <div className="overflow-hidden relative w-16 h-16 rounded-full border shadow-md border-slate-200">
                  <Image
                    src={userInfo.profile_image}
                    alt={`${userInfo.name || userInfo.github_id} avatar`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
              )}
              <a
                href={`https://github.com/${userInfo.github_id}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-600 underline hover:text-blue-700"
              >
                GitHub 프로필 열기
              </a>
            </div>
          </div>
        </section>

        <ContributionChart githubId={userInfo.github_id} />
        <RepoHighlights githubId={userInfo.github_id} />
        <StatsSection githubId={userInfo.github_id} />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <StreakStats githubId={userInfo.github_id} />
          <TrophyStats githubId={userInfo.github_id} />
        </div>
      </div>
    </div>
  );
};

export default Github;
