import React from 'react';
import { FiBookOpen } from 'react-icons/fi';

const RecentActivity = () => (
  <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
    <h2 className="text-xl font-semibold text-gray-900 mb-6">최근 활동</h2>
    <div className="space-y-4">
      <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
        <div className="p-3 bg-blue-100 rounded-lg">
          <FiBookOpen className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="text-gray-900 font-medium mb-1">새 글을 작성했습니다</p>
          <p className="text-sm text-gray-500">2시간 전</p>
        </div>
      </div>
    </div>
  </section>
);

export default RecentActivity;
