import Image from 'next/image';

interface ProfileProps {
  getDetailData?: {
    profile_image?: string | null;
    name?: string | null;
    github_id?: string | null;
    description?: string | null;
  };
}

const Profile = ({ getDetailData }: ProfileProps) => {
  const isDeletedUser = !getDetailData || !getDetailData.github_id;
  const profileImage = isDeletedUser
    ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
    : getDetailData.profile_image;
  const displayName = isDeletedUser
    ? '탈퇴한 사용자'
    : (getDetailData.name ?? getDetailData.github_id);

  return (
    <article className="flex items-center gap-x-4 p-2 mobile:mb-2">
      <figure className="w-[70px] h-[70px] tablet:w-[80px] tablet:h-[80px] desktop:w-[100px] desktop:h-[100px] rounded-full overflow-hidden">
        {profileImage && (
          <Image
            src={profileImage}
            alt="프로필 이미지"
            width={130}
            height={130}
            unoptimized={profileImage?.includes('googleusercontent.com')}
            className="object-cover w-full h-full"
          />
        )}
      </figure>

      <div className="flex flex-col w-full max-w-[250px]">
        <h2 className="text-sm tablet:text-lg text-ftBlack">{displayName}</h2>
        <div className="w-full text-gray-700 text-xs tablet:text-sm dark:text-gray-400 line-clamp-2">
          {!isDeletedUser && getDetailData?.description}
        </div>
      </div>
    </article>
  );
};

export default Profile;
