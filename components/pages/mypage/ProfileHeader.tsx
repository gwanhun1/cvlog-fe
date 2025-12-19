import React from 'react';
import Image from 'next/image';
import { FiGithub, FiCalendar } from 'react-icons/fi';

interface ProfileHeaderProps {
  profileImage: string | null | undefined;
  githubId: string | null | undefined;
  joinDate?: string | null;
}

const ProfileHeader = ({
  profileImage,
  githubId,
  joinDate,
}: ProfileHeaderProps) => (
  <div className="flex gap-6 items-center">
    <div className="overflow-hidden relative w-32 h-32 rounded-full border-4 border-white shadow-lg mobile:w-40 mobile:h-40">
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
        <div className="w-full h-full bg-gray-200 rounded-full animate-pulse" />
      )}
    </div>
    <div className="flex-1">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">{githubId}</h1>
      <div className="flex gap-2 items-center text-gray-600">
        <FiGithub className="w-4 h-4" aria-hidden="true" />
        <span>GitHub Developer</span>
      </div>
      {joinDate && (
        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border border-ftBlue/20 bg-ftBlue/5 text-ftGray">
          <FiCalendar className="flex-shrink-0 w-3 h-3 text-ftBlue" />
          <span className="font-medium">{joinDate}</span>
        </div>
      )}
    </div>
  </div>
);

export default React.memo(ProfileHeader);
