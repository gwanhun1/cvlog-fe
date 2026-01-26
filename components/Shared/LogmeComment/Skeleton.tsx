import React from 'react';

const CommentSkeleton = () => {
  return (
    <article className="mt-2 border-b border-gray-300 mobile:mt-5 animate-pulse">
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="flex flex-col space-y-1">
                <div className="w-20 h-4 bg-gray-200 rounded" />
                <div className="w-16 h-3 bg-gray-100 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full p-2 pl-6 pt-4 pb-6 space-y-2">
        <div className="w-full h-4 bg-gray-100 rounded" />
        <div className="w-5/6 h-4 bg-gray-100 rounded" />
      </div>
    </article>
  );
};

export default CommentSkeleton;
