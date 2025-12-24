import React, { useState } from 'react';
import { BsBell } from 'react-icons/bs';
import axios from 'axios';
import NotificationTooltip from './NotificationTooltip';
import { Notification } from './types';
import { useQuery } from '@tanstack/react-query';

const LogmeAlarm = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  const { data: notifications } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await axios.get('/api/notifications');
      return response.data;
    },
    refetchInterval: 30000,
  });

  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  return (
    <div className="relative inline-block">
      <button
        className="bg-none border-none cursor-pointer relative p-2 hover:opacity-70"
        onClick={() => setShowTooltip(!showTooltip)}
      >
        <BsBell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-[#ff4757] text-white rounded-full px-[6px] py-[2px] text-xs min-w-[8px] h-[8px] flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
      {showTooltip && <NotificationTooltip />}
    </div>
  );
};

export default LogmeAlarm;
