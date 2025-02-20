import React, { useMemo } from 'react';
import { GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import { FiCalendar, FiBookOpen, FiHeart } from 'react-icons/fi';
import { dehydrate, QueryClient } from 'react-query';
import ProfileHeader from '../../components/pages/mypage/ProfileHeader';
import StatsCard from '../../components/pages/mypage/StatsCard';
import AboutSection from '../../components/pages/mypage/AboutSection';
import ContactInfo from '../../components/pages/mypage/ContactInfo';
import AccountManagement from '../../components/pages/mypage/AccountManagement';
import { getUserInfo } from 'service/api/login';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userIdAtom } from 'service/atoms/atoms';

// 동적 임포트로 변경
const RecentActivity = dynamic(
  () => import('../../components/pages/mypage/RecentActivity'),
  {
    loading: () => (
      <div className="animate-pulse bg-white/5 rounded-lg p-8 h-48" />
    ),
    ssr: false,
  }
);

const Mypage = () => {
  const userInfo = useRecoilValue(userIdAtom);

  // 날짜 포맷팅 메모이제이션
  const formattedDate = useMemo(() => {
    try {
      return userInfo?.created_at
        ? new Date(userInfo.created_at).toLocaleDateString()
        : '날짜 정보 없음';
    } catch (error) {
      return '날짜 정보 없음';
    }
  }, [userInfo?.created_at]);

  if (!userInfo) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <div>로그인이 필요합니다.</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full min-h-[calc(100vh-80px)] bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-6xl px-4 py-8">
        <ProfileHeader
          profileImage={userInfo.profile_image}
          githubId={userInfo.github_id}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 mobile:grid-cols-2 tablet:grid-cols-3 gap-6 mb-8">
          <StatsCard icon={FiCalendar} title="가입일" value={formattedDate} />
          <StatsCard icon={FiBookOpen} title="작성한 글" value="0" />
          <StatsCard icon={FiHeart} title="받은 좋아요" value="0" />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 tablet:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="tablet:col-span-2 space-y-8">
            <AboutSection description={userInfo.description} />
            <RecentActivity />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <ContactInfo githubId={userInfo.github_id} />
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
    revalidate: 60, // 60초마다 재생성
  };
};

export default Mypage;
