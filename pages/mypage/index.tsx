import React, { useMemo } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import { FiCalendar } from 'react-icons/fi';
import ProfileHeader from '../../components/pages/mypage/ProfileHeader';
import HomeSection from '../../components/pages/mypage/HomeSection';
import ContactInfo from '../../components/pages/mypage/ContactInfo';
import AccountManagement from '../../components/pages/mypage/AccountManagement';
import GithubSyncSettings from '../../components/pages/mypage/GithubSync';
import { useGetUserInfo } from 'service/hooks/Login';
import AuthGuard from 'components/Shared/common/AuthGuard';

const cardBase =
  'relative overflow-hidden rounded-2xl border border-slate-100 bg-white/85 shadow-lg backdrop-blur transition-transform duration-200 hover:-translate-y-0.5';

const RecentActivity = dynamic(
  () => import('../../components/pages/mypage/RecentActivity'),
  {
    loading: () => (
      <div className="p-8 h-48 rounded-lg animate-pulse bg-white/5" />
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
    } catch (error) {
      return '날짜 정보 없음';
    }
  }, [userInfo?.created_at]);

  const joinDateLabel =
    formattedDate !== '날짜 정보 없음' ? formattedDate : null;

  return (
    <AuthGuard>
      <section className="w-full min-h-screen">
        <div className="px-4 py-6 mx-auto space-y-4 w-full max-w-6xl tablet:px-6 desktop:px-8">
          <section className={cardBase}>
            <div className="absolute inset-0 bg-gradient-to-br via-white to-blue-50 from-slate-50" />
            <div className="relative p-4">
              <ProfileHeader
                profileImage={userInfo?.profile_image}
                githubId={userInfo?.github_id}
                joinDate={joinDateLabel}
              />
            </div>
          </section>

          <div className="grid grid-cols-1 gap-2 tablet:grid-cols-3">
            <div className="space-y-3 tablet:col-span-2">
              <section className={cardBase}>
                <div className="absolute inset-0 bg-gradient-to-br via-white to-blue-50 from-slate-50" />
                <div className="relative p-4">
                  <div className="inline-flex gap-2 items-center px-2.5 py-1 mb-2 text-xs font-bold rounded-lg border border-ftBlue/30 bg-ftBlue/8 text-ftBlue">
                    Profile
                  </div>
                  <h2 className="text-base font-bold text-ftBlack">내 정보</h2>
                  <p className="mt-1 mb-4 text-xs text-ftGray">
                    소개와 활동 내역을 확인하세요.
                  </p>
                  <div className="space-y-3">
                    <HomeSection description={userInfo?.description} />
                    <RecentActivity />
                  </div>
                </div>
              </section>
            </div>

            <div className="space-y-3">
              <section className={cardBase}>
                <div className="absolute inset-0 bg-gradient-to-br via-white to-blue-50 from-slate-50" />
                <div className="relative p-4">
                  <div className="inline-flex gap-2 items-center px-2.5 py-1 mb-2 text-xs font-bold rounded-lg border border-ftBlue/30 bg-ftBlue/8 text-ftBlue">
                    Contact
                  </div>
                  <h2 className="text-sm font-bold text-ftBlack">연락처</h2>
                  <p className="mt-1 mb-3 text-xs text-ftGray">
                    외부 프로필/연동 정보를 관리합니다.
                  </p>
                  <div>
                    <ContactInfo githubId={userInfo?.github_id} />
                  </div>
                </div>
              </section>

              <section className={cardBase}>
                <div className="absolute inset-0 bg-gradient-to-br via-white to-blue-50 from-slate-50" />
                <div className="relative p-4">
                  <div className="inline-flex gap-2 items-center px-2.5 py-1 mb-2 text-xs font-bold rounded-lg border border-ftBlue/30 bg-ftBlue/8 text-ftBlue">
                    Sync
                  </div>
                  <h2 className="text-sm font-bold text-ftBlack">
                    GitHub 동기화
                  </h2>
                  <p className="mt-1 mb-3 text-xs text-ftGray">
                    게시물을 GitHub 저장소와 연동해 관리합니다.
                  </p>
                  <div>
                    <GithubSyncSettings />
                  </div>
                </div>
              </section>

              <section className={cardBase}>
                <div className="absolute inset-0 bg-gradient-to-br via-white to-blue-50 from-slate-50" />
                <div className="relative p-4">
                  <div className="inline-flex gap-2 items-center px-2.5 py-1 mb-2 text-xs font-bold rounded-lg border border-ftBlue/30 bg-ftBlue/8 text-ftBlue">
                    Account
                  </div>
                  <h2 className="text-sm font-bold text-ftBlack">계정 관리</h2>
                  <p className="mt-1 mb-3 text-xs text-ftGray">
                    로그아웃/계정 관련 설정을 변경합니다.
                  </p>
                  <div>
                    <AccountManagement />
                  </div>
                </div>
              </section>
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

  return {
    props: {},
  };
};

export default Mypage;
