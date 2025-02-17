import Image from 'next/image';

interface ProfileProps {
  getDetailData: any;
}

const Profile = ({ getDetailData }: ProfileProps) => {
  return (
    <>
      <article className="flex items-end justify-center mobile:mb-2">
        <figure className="w-14 h-14 mobile:w-[70px] mobile:h-[70px] tablet:w-[80px] tablet:h-[80px] desktop:w-[100px] desktop:h-[100px] rounded-full">
          {getDetailData && (
            <Image
              src={getDetailData?.profile_image}
              alt={'프로필 이미지'}
              width={130}
              height={130}
              className="rounded-full"
            />
          )}
        </figure>
        <div className="mb-1 space-y-1 font-medium tablet:mb-5 dark:text-white">
          <h2 className="text-xs tablet:text-lg text-ftBlick pl-5">
            {getDetailData && getDetailData.name !== null
              ? getDetailData.name
              : getDetailData?.github_id}
          </h2>
          <div className="h-4 overflow-hidden text-[4px] text-gray-700 desktop:text-xs w-36 mobile:w-40 desktop:w-60  dark:text-gray-400 pl-2 truncate">
            {getDetailData && getDetailData.description}
          </div>
        </div>
      </article>
    </>
  );
};

export default Profile;
