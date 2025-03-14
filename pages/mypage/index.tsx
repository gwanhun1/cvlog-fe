import React, { useMemo } from 'react';
import { GetStaticProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import { FiCalendar } from 'react-icons/fi';
import { dehydrate, QueryClient } from 'react-query';
import ProfileHeader from '../../components/pages/mypage/ProfileHeader';
import StatsCard from '../../components/pages/mypage/StatsCard';
import HomeSection from '../../components/pages/mypage/HomeSection';
import ContactInfo from '../../components/pages/mypage/ContactInfo';
import AccountManagement from '../../components/pages/mypage/AccountManagement';
import { getUserInfo } from 'service/api/login';
import { useGetUserInfo } from 'service/hooks/Login';

const RecentActivity = dynamic(
  () => import('../../components/pages/mypage/RecentActivity'),
  {
    loading: () => (
      <div className="animate-pulse bg-white/5 rounded-lg p-8 h-48" />
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
    <div className="flex justify-center w-full min-h-[calc(100vh-80px)] bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-6xl px-4 py-8">
        <ProfileHeader
          profileImage={userInfo?.profile_image}
          githubId={userInfo?.github_id}
        />

        <div className="grid grid-cols-1 tablet:grid-cols-3 gap-4">
          <div className="tablet:col-span-2 space-y-4">
            <StatsCard icon={FiCalendar} title="가입일" value={formattedDate} />
            <HomeSection description={userInfo?.description} />
            <RecentActivity />
          </div>

          <div className="space-y-4">
            <ContactInfo githubId={userInfo?.github_id} />
            <AccountManagement />
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['userInfo'], getUserInfo);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60,
  };
};

export default Mypage;
