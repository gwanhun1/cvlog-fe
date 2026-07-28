import React, { useState } from 'react';
import { useGetList } from 'service/hooks/List';
import MypageTaskSkeleton from './Skeleton';
import { formatRelativeTime } from 'utils/timer';
import ActivityRow from './ActivityRow';
import { BlogType } from 'service/api/tag/type';

const ITEMS_PER_PAGE = 5;

const RecentActivity: React.FC = () => {
  const [page, setPage] = useState(0);
  const List = useGetList(1);

  if (!List.data) {
    return <MypageTaskSkeleton />;
  }

  const totalPages = Math.ceil(List.data.posts.length / ITEMS_PER_PAGE);

  const displayedActivities = List.data.posts.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  return (
    <section className="p-8 bg-white rounded-xl border border-blue-100 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">최근 활동</h2>
      {List.data.posts.length === 0 ? (
        <div className="flex flex-col gap-2 items-center py-10 text-center">
          <svg
            className="w-10 h-10 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
          <p className="text-sm text-gray-400">아직 활동 내역이 없어요</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedActivities.map((activity: BlogType) => (
            <ActivityRow
              key={activity.id}
              title={activity.title}
              time={formatRelativeTime(activity.updated_at)}
              id={activity.id}
            />
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex gap-2 justify-center mt-6">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setPage(index)}
              className={`w-8 h-8 rounded-full ${
                page === index
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default React.memo(RecentActivity);
