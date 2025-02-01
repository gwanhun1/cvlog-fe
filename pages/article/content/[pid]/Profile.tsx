import React from 'react';
import Image from 'next/image';
import { useGetUserInfo } from 'service/hooks/Login';

const Profile = () => {
  const getUserInfo = useGetUserInfo();
  return (
    <>
      <article className="flex items-end justify-center mobile:mb-2">
        <figure className="w-14 h-14 mobile:w-[70px] mobile:h-[70px] tablet:w-[80px] tablet:h-[80px] desktop:w-[100px] desktop:h-[100px] rounded-full">
          {getUserInfo.data && (
            <Image
              src={getUserInfo.data?.profile_image}
              alt={'프로필 이미지'}
              width={130}
              height={130}
              className="rounded-full"
            />
          )}
        </figure>
        <div className="mb-1 space-y-1 font-medium tablet:mb-5 dark:text-white">
          <h2 className="text-[7px] tablet:text-xs text-ftBlick pl-5">
            {getUserInfo.data && getUserInfo.data.name !== null
              ? getUserInfo.data.name
              : getUserInfo.data?.github_id}
          </h2>
          <div className="h-4 overflow-hidden text-[4px] text-gray-700 desktop:text-xs w-36 mobile:w-40 desktop:w-60 desktop:w-full dark:text-gray-400 pl-2 truncate">
            {getUserInfo.data && getUserInfo.data.description}
          </div>
        </div>
      </article>
    </>
  );
};

export default Profile;
