import React from 'react';
import { GetServerSideProps } from 'next';
import { FiCalendar, FiBookOpen, FiHeart } from 'react-icons/fi';
import { getUserInfo } from 'service/api/login';
import { useGetUserInfo } from 'service/hooks/Login';
import ProfileHeader from '../../components/pages/mypage/ProfileHeader';
import StatsCard from '../../components/pages/mypage/StatsCard';
import AboutSection from '../../components/pages/mypage/AboutSection';
import RecentActivity from '../../components/pages/mypage/RecentActivity';
import ContactInfo from '../../components/pages/mypage/ContactInfo';
import AccountManagement from '../../components/pages/mypage/AccountManagement';

const Mypage = () => {
  const { data: info } = useGetUserInfo();

  if (!info) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <div>로그인이 필요합니다.</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full min-h-[calc(100vh-80px)] bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-6xl px-4 py-8">
        <ProfileHeader profileImage={info.profile_image} githubId={info.github_id} />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 mobile:grid-cols-2 tablet:grid-cols-3 gap-6 mb-8">
          <StatsCard
            icon={FiCalendar}
            title="가입일"
            value={info.created_at ? new Date(info.created_at).toLocaleDateString() : '-'}
          />
          <StatsCard icon={FiBookOpen} title="작성한 글" value="0" />
          <StatsCard icon={FiHeart} title="받은 좋아요" value="0" />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 tablet:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="tablet:col-span-2 space-y-8">
            <AboutSection description={info.description} />
            <RecentActivity />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <ContactInfo githubId={info.github_id} />
            <AccountManagement />
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const accessToken = context.req.cookies['CVtoken'] || '';
  const refreshToken = context.req.cookies['refreshToken'] || '';

  if (!accessToken || !refreshToken) {
    return {
      props: {
        error: 'Not authenticated',
      },
    };
  }

  try {
    const userInfo = await getUserInfo();
    return {
      props: {
        userInfo,
      },
    };
  } catch (error) {
    return {
      props: {
        error: 'Failed to fetch user info',
      },
    };
  }
};

export default Mypage;
