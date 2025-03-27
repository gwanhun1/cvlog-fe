import React, { useMemo } from 'react';
import { GetServerSideProps, NextPage } from 'next';
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  // 쿠키 확인 (인증 여부 확인 가능)
  const cookie = context.req.headers.cookie;
  
  // 쿠키가 없으면 로그인 페이지로 리디렉션
  if (!cookie) {
    return {
      redirect: {
        destination: '/login?redirect=/mypage',
        permanent: false,
      },
    };
  }
  
  // QueryClient 초기화
  const queryClient = new QueryClient();
  
  try {
    // 서버 사이드에서 사용자 정보를 가져오기 위한 함수
    const fetchUserInfo = async () => {
      // 백엔드 API URL
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.logme.shop';
      
      // 쿠키에서 토큰 추출 - 실제 토큰 이름에 따라 조정 필요
      const tokenMatch = cookie.match(/LogmeToken=([^;]+)/);
      const token = tokenMatch ? tokenMatch[1] : null;
      
      if (!token) {
        throw new Error('인증 토큰이 없습니다');
      }
      
      // 서버에서 요청 보내기
      const response = await fetch(`${API_URL}/users/info`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Cookie: cookie
        },
      });
      
      if (!response.ok) {
        throw new Error(`사용자 정보 조회 실패: ${response.status}`);
      }
      
      return response.json();
    };
    
    // 사용자 정보 미리 가져오기
    await queryClient.prefetchQuery(['userInfo'], fetchUserInfo);
    
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  } catch (error) {
    console.error('마이페이지 데이터 로드 오류:', error instanceof Error ? error.message : '알 수 없는 오류');
    
    // 인증 실패 시 로그인 페이지로 리디렉션
    return {
      redirect: {
        destination: '/login?redirect=/mypage',
        permanent: false,
      },
    };
  }
};

export default Mypage;
