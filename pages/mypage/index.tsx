import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getUserInfo } from 'service/api/login';
import {
  FiGithub,
  FiMail,
  FiCalendar,
  FiEdit3,
  FiBookOpen,
  FiHeart,
} from 'react-icons/fi';

const StatsCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: any;
}) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-blue-50 rounded-lg">
        <Icon className="w-5 h-5 text-blue-500" />
      </div>
      <div>
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className="text-lg font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const Mypage = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await getUserInfo();
        setUserInfo(response);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        Loading...
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        로그인이 필요합니다.
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full min-h-[calc(100vh-80px)] bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-6xl px-4 py-8">
        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-12">
          <div className="relative w-32 h-32 mobile:w-40 mobile:h-40 overflow-hidden rounded-full border-4 border-white shadow-lg">
            {userInfo.profile_image && (
              <Image
                src={userInfo.profile_image}
                alt="User Profile"
                fill
                sizes="(max-width: 768px) 128px, 160px"
                className="object-cover"
                priority
              />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {userInfo.github_id}
            </h1>
            <div className="flex items-center gap-2 text-gray-600">
              <FiGithub className="w-4 h-4" />
              <span>GitHub Developer</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 mobile:grid-cols-2 tablet:grid-cols-3 gap-6 mb-8">
          <StatsCard
            icon={FiCalendar}
            title="가입일"
            value={
              userInfo.created_at
                ? new Date(userInfo.created_at).toLocaleDateString()
                : '-'
            }
          />
          <StatsCard icon={FiBookOpen} title="작성한 글" value="0" />
          <StatsCard icon={FiHeart} title="받은 좋아요" value="0" />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 tablet:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="tablet:col-span-2 space-y-8">
            {/* About Section */}
            <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  자기소개
                </h2>
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                  <FiEdit3 className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                {userInfo.description || '자기소개를 작성해주세요.'}
              </p>
            </section>

            {/* Recent Activity */}
            <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                최근 활동
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FiBookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium mb-1">
                      새 글을 작성했습니다
                    </p>
                    <p className="text-sm text-gray-500">2시간 전</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Contact Info */}
            <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                연락처 정보
              </h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <FiMail className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium mb-1">
                      {userInfo.github_id}@github.com
                    </p>
                    <p className="text-sm text-gray-500">이메일</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <FiGithub className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium mb-1">
                      github.com/{userInfo.github_id}
                    </p>
                    <p className="text-sm text-gray-500">GitHub</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Account Management */}
            <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                계정 관리
              </h2>
              <div className="space-y-4">
                <button
                  onClick={() => alert('업데이트 중입니다')}
                  className="w-full px-4 py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
                >
                  회원 탈퇴
                </button>
                <p className="text-xs text-gray-500 leading-relaxed">
                  탈퇴 시 작성하신 포스트 및 댓글이 모두 삭제되며 복구되지
                  않습니다.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mypage;
