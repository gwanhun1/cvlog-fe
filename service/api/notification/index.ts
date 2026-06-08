import { axiosInstance } from 'utils/axios';

export interface NotificationItem {
  id: number;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
  post: { id: number } | null;
}

export const getNotifications = async (): Promise<NotificationItem[]> => {
  const { data } = await axiosInstance.get('/notifications');
  return data;
};

export const getUnreadCount = async (): Promise<number> => {
  const { data } = await axiosInstance.get('/notifications/unread-count');
  return data.count;
};

export const markAsRead = async (id: number): Promise<void> => {
  await axiosInstance.post(`/notifications/${id}/read`);
};

export const markAllAsRead = async (): Promise<void> => {
  await axiosInstance.post('/notifications/read-all');
};

export const savePushSubscription = async (sub: PushSubscription): Promise<void> => {
  const json = sub.toJSON();
  await axiosInstance.post('/notifications/push-subscribe', {
    endpoint: json.endpoint,
    keys: { p256dh: json.keys?.p256dh, auth: json.keys?.auth },
  });
};

export const removePushSubscription = async (endpoint: string): Promise<void> => {
  await axiosInstance.delete('/notifications/push-subscribe', {
    data: { endpoint },
  });
};
