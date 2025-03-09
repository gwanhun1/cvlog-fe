/* eslint-disable @next/next/no-img-element */
import React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import Link from 'next/link';

interface Notification {
  id: number;
  type: 'comment' | 'like';
  message: string;
  read: boolean;
  created_at: string;
  post: {
    id: string;
    title: string;
  };
  user: {
    github_id: string;
    avatar_url: string;
  };
}

const TooltipContainer = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  width: 300px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
`;

const EmptyState = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
`;

const NotificationTooltip = () => {
  const { data: notifications, refetch } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await axios.get('/api/notifications');
      return response.data;
    },
  });

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}일 전`;
    if (hours > 0) return `${hours}시간 전`;
    if (minutes > 0) return `${minutes}분 전`;
    return '방금 전';
  };

  return (
    <TooltipContainer>
      {notifications && notifications?.length ? (
        notifications.map(notification => (
          <Link
            href={`/article/content/all/${notification.post.id}`}
            key={notification.id}
            prefetch
          >
            <div className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer">
              <div className="flex-shrink-0">
                <img
                  className="w-11 h-11 rounded-full"
                  src={notification.user.avatar_url}
                  alt={`${notification.user.github_id}'s avatar`}
                />
              </div>
              <div className="w-full pl-3">
                <div className="text-gray-500 text-sm mb-1.5">
                  <span className="font-semibold text-gray-900">
                    {notification.user.github_id}
                  </span>{' '}
                  님이 회원님의 게시글에 댓글을 남겼습니다:
                </div>
                <div className="text-xs text-blue-600">
                  {notification.post.title}
                </div>
                <span className="text-xs text-gray-500">
                  {formatTime(notification.created_at)}
                </span>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <EmptyState>새로운 알림이 없습니다</EmptyState>
      )}
    </TooltipContainer>
  );
};

export default NotificationTooltip;
