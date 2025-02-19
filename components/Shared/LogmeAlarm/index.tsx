import React, { useState } from 'react';
import styled from 'styled-components';
import { BsBell } from 'react-icons/bs';
import axios from 'axios';
import NotificationTooltip from './NotificationTooltip';
import { Notification } from './types';
import { useQuery } from 'react-query';

const AlarmContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const AlarmButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
  padding: 8px;

  &:hover {
    opacity: 0.7;
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  background-color: #ff4757;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
  min-width: 8px;
  height: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

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
    <AlarmContainer>
      <AlarmButton onClick={() => setShowTooltip(!showTooltip)}>
        <BsBell size={24} />
        {unreadCount > 0 && (
          <NotificationBadge>{unreadCount}</NotificationBadge>
        )}
      </AlarmButton>
      {showTooltip && <NotificationTooltip />}
    </AlarmContainer>
  );
};

export default LogmeAlarm;
