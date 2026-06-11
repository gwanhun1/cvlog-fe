import React, { useMemo } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import ProfileHeader from '../../components/pages/mypage/ProfileHeader';
import HomeSection from '../../components/pages/mypage/HomeSection';
import ContactInfo from '../../components/pages/mypage/ContactInfo';
import AccountManagement from '../../components/pages/mypage/AccountManagement';
import GithubSyncSettings from '../../components/pages/mypage/GithubSync';
import { useGetUserInfo } from 'service/hooks/Login';
import AuthGuard from 'components/Shared/common/AuthGuard';

const cardBase =
  'rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden';

const SectionCard = ({
  label,
  title,
  subtitle,
  children,
}: {
  label: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <section className={cardBase}>
    <div className="p-5">
      <div className="inline-flex items-center px-2 py-0.5 mb-3 text-[11px] font-semibold rounded-md border border-ftBlue/20 bg-ftBlue/5 text-ftBlue uppercase tracking-wide">
        {label}
      </div>
      <div className="text-sm font-semibold text-ftBlack mb-0.5">{title}</div>
      {subtitle && <div className="text-xs text-ftGray mb-3">{subtitle}</div>}
      {children}
    </div>
  </section>
);

const RecentActivity = dynamic(
  () => import('../../components/pages/mypage/RecentActivity'),
  {
    loading: () => (
      <div className="h-32 rounded-lg animate-pulse bg-gray-100" />
    ),
    ssr: false,
  },
);

const Mypage: NextPage = () => {
  const { data: userInfo } = useGetUserInfo();

  const formattedDate = useMemo(() => {
    try {
      return userInfo?.created_at
        ? new Date(userInfo.created_at).toLocaleDateString()
        : '날짜 정보 없음';
    } catch {
      return '날짜 정보 없음';
    }
  }, [userInfo?.created_at]);

  const joinDateLabel =
    formattedDate !== '날짜 정보 없음' ? formattedDate : null;

  return (
    <AuthGuard>
      <section className="w-full min-h-screen">
        <div className="mx-auto space-y-4 w-full max-w-6xl">
          {/* 프로필 헤더 */}
          <section className={cardBase}>
            <div className="p-5">
              <ProfileHeader
                profileImage={userInfo?.profile_image}
                githubId={userInfo?.github_id}
                joinDate={joinDateLabel}
              />
            </div>
          </section>

          <div className="grid grid-cols-1 gap-4 tablet:grid-cols-3">
            {/* 왼쪽: 내 정보 */}
            <div className="space-y-4 tablet:col-span-2">
              <SectionCard
                label="Profile"
                title="내 정보"
                subtitle="소개와 활동 내역을 확인하세요."
              >
                <div className="space-y-4">
                  <HomeSection description={userInfo?.description} />
                  <RecentActivity />
                </div>
              </SectionCard>
            </div>

            {/* 오른쪽: 사이드 카드들 */}
            <div className="space-y-4">
              <SectionCard
                label="Contact"
                title="연락처"
                subtitle="외부 프로필/연동 정보를 관리합니다."
              >
                <ContactInfo githubId={userInfo?.github_id} />
              </SectionCard>

              <SectionCard
                label="Sync"
                title="GitHub 동기화"
                subtitle="게시물을 GitHub 저장소와 연동해 관리합니다."
              >
                <GithubSyncSettings />
              </SectionCard>

              <Link href="/github" className="block">
                <section
                  className={`${cardBase} cursor-pointer group hover:border-ftBlue/30 transition-colors`}
                >
                  <div className="p-5">
                    <div className="inline-flex items-center px-2 py-0.5 mb-3 text-[11px] font-semibold rounded-md border border-ftBlue/20 bg-ftBlue/5 text-ftBlue uppercase tracking-wide">
                      GitHub
                    </div>
                    <div className="text-sm font-semibold text-ftBlack mb-0.5">
                      GitHub 통계
                    </div>
                    <div className="text-xs text-ftGray mb-3">
                      기여 현황, 언어 분포, 레포지토리 하이라이트를 확인합니다.
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-ftBlue group-hover:gap-2 transition-all">
                      통계 보기
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>
                  </div>
                </section>
              </Link>

              <SectionCard
                label="Account"
                title="계정 관리"
                subtitle="로그아웃/계정 관련 설정을 변경합니다."
              >
                <AccountManagement />
              </SectionCard>
            </div>
          </div>
        </div>
      </section>
    </AuthGuard>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const hasRefreshToken = context.req.headers.cookie?.includes('refreshToken');

  if (!hasRefreshToken) {
    return {
      redirect: {
        destination: '/login?redirect=/mypage',
        permanent: false,
      },
    };
  }

  return { props: {} };
};

export default Mypage;
