import React, { useState } from 'react';
import { FiBookOpen } from 'react-icons/fi';

interface ActivityItem {
  id: number;
  title: string;
  time: string;
}

const ITEMS_PER_PAGE = 5;

const DUMMY_ACTIVITIES: ActivityItem[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `활동 ${i + 1}`,
  time: `${Math.floor(Math.random() * 24)}시간 전`,
}));

const ActivityRow = React.memo(
  ({ title, time }: { title: string; time: string }) => (
    <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg mb-4 transition-colors hover:bg-gray-100">
      <div className="p-3 bg-blue-100 rounded-lg">
        <FiBookOpen className="w-5 h-5 text-blue-600" aria-hidden="true" />
      </div>
      <div>
        <p className="text-gray-900 font-medium mb-1">{title}</p>
        <p className="text-sm text-gray-500">{time}</p>
      </div>
    </div>
  )
);

ActivityRow.displayName = 'ActivityRow';

const RecentActivity: React.FC = () => {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(DUMMY_ACTIVITIES.length / ITEMS_PER_PAGE);

  const displayedActivities = DUMMY_ACTIVITIES.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  return (
    <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">최근 활동</h2>
      <div className="space-y-4">
        {displayedActivities.map(activity => (
          <ActivityRow
            key={activity.id}
            title={activity.title}
            time={activity.time}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
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
