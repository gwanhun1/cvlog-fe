import React from 'react';
import { IconType } from 'react-icons';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: IconType;
  className?: string;
}

const StatsCard = ({ title, value, icon: Icon, className = '' }: StatsCardProps) => (
  <div className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 ${className}`}>
    <div className="flex items-center gap-3">
      <div className="p-2 bg-blue-50 rounded-lg">
        <Icon className="w-5 h-5 text-blue-500" aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className="text-lg font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

export default React.memo(StatsCard);
