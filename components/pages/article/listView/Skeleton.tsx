import React from 'react';

const CardSkeleton = () => (
  <article className="group block tablet:min-w-[363px] hover:bg-blue-50 overflow-hidden transition-all duration-300 bg-white border border-blue-100 rounded-lg shadow-sm hover:shadow-lg relative animate-pulse">
    <div className="flex flex-col h-full">
      <div className="relative w-full h-0 pb-[70%] bg-gray-200 rounded-t-lg"></div>

      <div className="flex flex-col justify-between p-5 w-full flex-grow">
        <div className="h-full flex flex-col">
          <div className="mb-2 h-8 bg-gray-200 rounded w-3/4"></div>

          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>

          <div className="flex items-center mt-auto pt-4">
            <div className="flex-1 flex gap-2">
              <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
              <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
              <div className="h-6 w-14 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="absolute bottom-3 right-4 bg-gray-200 rounded-full px-3 py-1 h-6 w-24"></div>
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
