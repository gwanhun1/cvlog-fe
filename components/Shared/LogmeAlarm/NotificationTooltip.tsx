import React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';

interface Notification {
  id: number;
  type: 'comment' | 'like';
  message: string;
  read: boolean;
  created_at: string;
  post: {
    id: string;
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

const NotificationItem = styled.div<{ read: boolean }>`
  padding: 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  background-color: ${props => (props.read ? 'white' : '#f0f7ff')};

  &:hover {
    background-color: ${props => (props.read ? '#f5f5f5' : '#e6f0ff')};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Message = styled.p`
  margin: 0;
  font-size: 14px;
  color: #333;
`;

const Time = styled.span`
  font-size: 12px;
  color: #666;
  display: block;
  margin-top: 4px;
`;

const EmptyState = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
`;

const NotificationTooltip = () => {
  const router = useRouter();
  const { data: notifications, refetch } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await axios.get('/api/notifications');
      return response.data;
    },
  });

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await axios.post(`/api/notifications/${notification.id}/read`);
      refetch();
    }
    router.push(`/article/content/all/${notification.post.id}`);
  };

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
        notifications.map((notification: Notification) => (
          <NotificationItem
            key={notification.id}
            read={notification.read}
            onClick={() => handleNotificationClick(notification)}
          >
            <Message>{notification.message}</Message>
            <Time>{formatTime(notification.created_at)}</Time>
          </NotificationItem>
        ))
      ) : (
        <EmptyState>새로운 알림이 없습니다</EmptyState>
      )}
    </TooltipContainer>
  );
};

export default NotificationTooltip;
