const CardSkeleton = () => (
  <article className="block overflow-hidden relative bg-white rounded-lg border border-blue-100 shadow-sm transition-all duration-300 animate-pulse group hover:bg-blue-50 hover:shadow-lg">
    <div className="flex flex-col h-full">
      <div className="relative w-full h-0 pb-[70%] bg-gray-200 rounded-t-lg" />

      <div className="flex flex-col flex-grow justify-between p-5 w-full">
        <div className="flex flex-col h-full">
          <div className="mb-2 w-3/4 h-8 bg-gray-200 rounded" />

          <div className="space-y-2">
            <div className="w-full h-4 bg-gray-200 rounded" />
            <div className="w-5/6 h-4 bg-gray-200 rounded" />
            <div className="w-4/6 h-4 bg-gray-200 rounded" />
          </div>

          <div className="flex items-center pt-4 mt-auto">
            <div className="flex flex-1 gap-2">
              <div className="w-16 h-6 bg-gray-200 rounded-full" />
              <div className="w-20 h-6 bg-gray-200 rounded-full" />
              <div className="w-14 h-6 bg-gray-200 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>
);

const SkeletonLoader = () => {
  return (
    <div className="masonry-grid">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="masonry-item break-inside-avoid">
          <div className="block h-full">
            <CardSkeleton />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardSkeleton;
export { SkeletonLoader };
