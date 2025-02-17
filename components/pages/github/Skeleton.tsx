import React from 'react';

const SkeletonCard = () => (
  <div className="w-full p-6 bg-white/5 rounded-lg shadow-md animate-pulse">
    <div className="space-y-4">
      <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
      <div className="h-40 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
);

export const SkeletonLayout = () => (
  <div className="container mx-auto px-4 py-8 min-h-[90vh]">
    <div className="max-w-4xl mx-auto space-y-6">
      <SkeletonCard />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <SkeletonCard />
      <SkeletonCard />
    </div>
  </div>
);
