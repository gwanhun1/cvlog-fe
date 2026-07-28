import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiGithub, FiCalendar, FiUser } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { SiNaver } from 'react-icons/si';
import { AiOutlineHeart } from 'react-icons/ai';
import type { AuthProvider } from 'service/api/login/type';

interface ProfileHeaderProps {
  profileImage: string | null | undefined;
  displayName: string;
  joinDate?: string | null;
  providers?: AuthProvider[];
}

const PROVIDER_META: Record<AuthProvider, { label: string; icon: React.ReactNode }> = {
  github: { label: 'GitHub Developer', icon: <FiGithub className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" /> },
  google: { label: 'Google 계정', icon: <FcGoogle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" /> },
  kakao: { label: '카카오 계정', icon: <RiKakaoTalkFill className="w-3.5 h-3.5 flex-shrink-0 text-[#FEE500]" aria-hidden="true" /> },
  naver: { label: '네이버 계정', icon: <SiNaver className="w-3.5 h-3.5 flex-shrink-0 text-[#03C75A]" aria-hidden="true" /> },
};

const ProfileHeader = ({ profileImage, displayName, joinDate, providers }: ProfileHeaderProps) => {
  // 여러 provider를 연동했을 수 있으니 첫 번째 것을 대표로 보여준다.
  // providers가 아직 안 내려온 구버전 캐시 상태에서는 중립적인 라벨로 폴백한다.
  const primary = providers?.[0] ? PROVIDER_META[providers[0]] : null;

  return (
  <div className="flex gap-4 items-center justify-between">
    <div className="flex gap-4 items-center min-w-0">
      <div className="overflow-hidden relative w-16 h-16 rounded-full border-2 border-gray-100 shadow-sm flex-shrink-0">
        {profileImage ? (
          <Image
            src={profileImage}
            alt={`${displayName}'s profile`}
            fill
            sizes="64px"
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gray-100 rounded-full animate-pulse" />
        )}
      </div>
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-widest text-ftGray mb-0.5">My Page</div>
        <div className="text-xl font-bold text-gray-900 truncate">{displayName}</div>
        <div className="flex flex-col gap-0.5 mt-0.5">
          <div className="flex gap-2 items-center text-gray-400 text-sm">
            {primary?.icon ?? <FiUser className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />}
            <span>{primary?.label ?? '멤버'}</span>
          </div>
          {joinDate && (
            <div className="flex gap-1.5 items-center text-gray-400">
              <FiCalendar className="w-3.5 h-3.5 flex-shrink-0 text-ftBlue" />
              <span className="text-xs">{joinDate}</span>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* 좋아요한 글 바로가기 */}
    <Link
      href="/article/liked"
      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-red-100 text-red-400 bg-red-50 hover:bg-red-100 hover:border-red-200 transition-colors"
    >
      <AiOutlineHeart className="text-sm" />
      좋아요한 글
    </Link>
  </div>
  );
};

export default React.memo(ProfileHeader);
