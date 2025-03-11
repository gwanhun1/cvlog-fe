import React from 'react';
import Image from 'next/image';
import { FiGithub } from 'react-icons/fi';

interface ProfileHeaderProps {
  profileImage: string | null | undefined;
  githubId: string | null | undefined;
}

const ProfileHeader = ({ profileImage, githubId }: ProfileHeaderProps) => (
  <div className="flex items-center gap-6 mb-12">
    <div className="relative w-32 h-32 mobile:w-40 mobile:h-40 overflow-hidden rounded-full border-4 border-white shadow-lg">
      {profileImage ? (
        <Image
          src={profileImage}
          alt={`${githubId}'s profile`}
          fill
          sizes="(max-width: 768px) 128px, 160px"
          className="object-cover"
          priority
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRsdHR8fIR0hISEdISMkIyIiIyMkMjYqKio2MTM3NTc1R0ZHSFFIU0tLV1dXV1dXV1f/2wBDARAVFhgYGCEeHiE3KjIqV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1f/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />
      ) : (
        <div className="w-full h-full bg-gray-200 animate-pulse rounded-full" />
      )}
    </div>
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{githubId}</h1>
      <div className="flex items-center gap-2 text-gray-600">
        <FiGithub className="w-4 h-4" aria-hidden="true" />
        <span>GitHub Developer</span>
      </div>
    </div>
  </div>
);

export default React.memo(ProfileHeader);
