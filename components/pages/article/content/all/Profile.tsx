import Image from 'next/image';

interface ProfileProps {
  getDetailData: any;
}

const Profile = ({ getDetailData }: ProfileProps) => {
  return (
    <article className="flex items-center gap-x-4 p-2 mobile:mb-2">
      <figure className="w-[70px] h-[70px] tablet:w-[80px] tablet:h-[80px] desktop:w-[100px] desktop:h-[100px] rounded-full overflow-hidden">
        {getDetailData?.profile_image && (
          <Image
            src={getDetailData.profile_image}
            alt="프로필 이미지"
            width={130}
            height={130}
            className="rounded-full object-cover w-full h-full"
          />
        )}
      </figure>

      <div className="flex flex-col w-full max-w-[250px]">
        <h2 className="text-sm tablet:text-lg text-ftBlack">
          {getDetailData?.name ?? getDetailData?.github_id}
        </h2>
        <div className="w-full text-gray-700 text-xs tablet:text-sm dark:text-gray-400 line-clamp-2">
          {getDetailData?.description}
        </div>
      </div>
    </article>
  );
};

export default Profile;
