export const ContentSkeleton = () => (
  <div className="space-y-10">
    <div className="space-y-2">
      <div className="w-full h-60 bg-gray-200 rounded"></div>
    </div>

    <div className="space-y-2">
      <div className="w-3/4 h-8 bg-gray-200 rounded-lg"></div>
      <div className="w-full h-4 bg-gray-200 rounded"></div>
      <div className="w-5/6 h-4 bg-gray-200 rounded"></div>
      <div className="w-4/6 h-4 bg-gray-200 rounded"></div>
    </div>

    <div className="space-y-2">
      <div className="w-full h-4 bg-gray-200 rounded"></div>
      <div className="w-5/6 h-4 bg-gray-200 rounded"></div>
      <div className="w-4/6 h-4 bg-gray-200 rounded"></div>
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <article className="flex gap-x-4 items-center p-2 animate-pulse mobile:mb-2">
    <div className="w-[70px] h-[70px] tablet:w-[80px] tablet:h-[80px] desktop:w-[100px] desktop:h-[100px] rounded-full bg-gray-200" />
    <div className="flex flex-col w-full max-w-[250px] space-y-2">
      <div className="w-24 h-5 bg-gray-200 rounded" />
      <div className="w-full h-4 bg-gray-100 rounded" />
    </div>
  </article>
);

export default ContentSkeleton;
