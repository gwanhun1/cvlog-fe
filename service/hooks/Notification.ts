import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from 'service/api/notification';
import LocalStorage from 'public/utils/Localstorage';

const isLoggedIn = () => !!LocalStorage.getItem('LogmeToken');

// 드롭다운이 열릴 때만 fetch (enabled=true 일 때)
export const useGetNotifications = (enabled = false) => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
    enabled: isLoggedIn() && enabled,
    staleTime: 1000 * 30,
    refetchInterval: enabled ? 1000 * 30 : false,
  });
};

// 뱃지용 — 항상 30초 폴링 (숫자 하나라 매우 가벼움)
export const useGetUnreadCount = () => {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: getUnreadCount,
    enabled: isLoggedIn(),
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 30,
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
