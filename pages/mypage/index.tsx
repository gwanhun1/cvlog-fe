import React, { useMemo } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import { FiCalendar } from 'react-icons/fi';
import ProfileHeader from '../../components/pages/mypage/ProfileHeader';
import StatsCard from '../../components/pages/mypage/StatsCard';
import HomeSection from '../../components/pages/mypage/HomeSection';
import ContactInfo from '../../components/pages/mypage/ContactInfo';
import AccountManagement from '../../components/pages/mypage/AccountManagement';
import GithubSyncSettings from '../../components/pages/mypage/GithubSync';
import { useGetUserInfo } from 'service/hooks/Login';

const RecentActivity = dynamic(
  () => import('../../components/pages/mypage/RecentActivity'),
  {
    loading: () => (
      <div className="p-8 h-48 rounded-lg animate-pulse bg-white/5" />
    ),
    ssr: false,
  }
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

  return (
    <section className="w-full min-h-screen bg-gradient-to-b from-bgWhite via-white to-[#e7edf5]">
      <div className="px-4 py-10 mx-auto space-y-8 w-full max-w-6xl tablet:px-6 desktop:px-10">
        <ProfileHeader
          profileImage={userInfo?.profile_image}
          githubId={userInfo?.github_id}
        />

        <div className="grid grid-cols-1 gap-6 tablet:grid-cols-3">
          <div className="space-y-6 tablet:col-span-2">
            <StatsCard icon={FiCalendar} title="가입일" value={formattedDate} />
            <HomeSection description={userInfo?.description} />
            <RecentActivity />
          </div>

          <div className="space-y-6">
            <ContactInfo githubId={userInfo?.github_id} />
            <GithubSyncSettings />
            <AccountManagement />
          </div>
        </div>
      </div>
    </section>
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
