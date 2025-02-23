import React from 'react';
import SkeletonCard from './SkeletonCard';

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
