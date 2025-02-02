import React, { useEffect, useState } from 'react';
import { useGetPublicList } from 'service/hooks/List';
import LogmeAllCard from 'components/Shared/LogmeAllCard';
import { Pagination } from 'flowbite-react';

const CardSkeleton = () => (
  <div className="w-[290px]">
    <div className="rounded-lg h-[280px] w-full bg-white shadow-md border border-gray-100 overflow-hidden">
      {/* Image Skeleton */}
      <div className="h-32 w-full bg-gray-200 animate-pulse" />

      {/* Content Skeleton */}
      <div className="p-4 flex flex-col h-[calc(280px-128px)]">
        {/* Title Skeleton */}
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />

        {/* Content Skeleton */}
        <div className="space-y-2 mb-3">
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
        </div>

        {/* Tags Skeleton */}
        <div className="mt-auto">
          <div className="flex gap-1.5 mb-2">
            <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" />
          </div>
          {/* Time Skeleton */}
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
        </div>
      </div>
    </div>
  </div>
);

const AllView = () => {
  const [page, setPage] = useState<number>(1);
  const { data: List, isLoading } = useGetPublicList(page);

  const onPageChange = (page: number) => {
    setPage(page);
  };

  useEffect(() => {
    // List.refetch();
  }, [page]);

  // Generate skeleton array when loading
  const skeletonArray = Array(8).fill(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold text-gray-500 shrink-0">
          전체 게시물
        </h2>
        <div className="border-b border-gray-300 w-full self-center mb-3" />
      </div>
      <div className="flex flex-wrap gap-6">
        {isLoading
          ? skeletonArray.map((_, index) => <CardSkeleton key={index} />)
          : List?.posts?.map(post => (
              <div key={post.id} className="w-[290px]">
                <LogmeAllCard
                  title={post.title}
                  content={post.content}
                  tags={post.tags}
                  updated_at={post.updated_at}
                />
              </div>
            ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center py-6">
        {List && List.maxPage && List.maxPage !== 1 && (
          <Pagination
            className="white"
            currentPage={page}
            onPageChange={onPageChange}
            totalPages={List.maxPage}
            showIcons={true}
            previousLabel=""
            nextLabel=""
          />
        )}
      </div>
    </div>
  );
};

export default AllView;
