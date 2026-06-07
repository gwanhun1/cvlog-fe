import React from 'react';
import Image from 'next/image';
import { FiGithub, FiCalendar } from 'react-icons/fi';

interface ProfileHeaderProps {
  profileImage: string | null | undefined;
  githubId: string | null | undefined;
  joinDate?: string | null;
}

const ProfileHeader = ({ profileImage, githubId, joinDate }: ProfileHeaderProps) => (
  <div className="flex gap-4 items-center">
    <div className="overflow-hidden relative w-16 h-16 rounded-full border-2 border-gray-100 shadow-sm flex-shrink-0">
      {profileImage ? (
        <Image
          src={profileImage}
          alt={`${githubId}'s profile`}
          fill
          sizes="64px"
          className="object-cover"
          priority
        />
      ) : (
        <div className="w-full h-full bg-gray-100 rounded-full animate-pulse" />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-xs uppercase tracking-widest text-ftGray mb-0.5">My Page</div>
      <div className="text-xl font-bold text-gray-900 truncate">{githubId}</div>
      <div className="flex gap-2 items-center text-gray-400 text-sm mt-0.5">
        <FiGithub className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
        <span>GitHub Developer</span>
        {joinDate && (
          <>
            <span className="text-gray-200">·</span>
            <FiCalendar className="w-3.5 h-3.5 flex-shrink-0 text-ftBlue" />
            <span className="text-xs">{joinDate}</span>
          </>
        )}
      </div>
    </div>
  </div>
);

export default React.memo(ProfileHeader);
