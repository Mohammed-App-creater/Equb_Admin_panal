
import api from './axios';

export interface Notification {
  id: string;
  message: string;
  updated_at: string;
  is_read: boolean;
  notif_type: string;
}

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await api.get<{results: { data: Notification[], message: string}}>(`/notifications/`);
  return response?.data?.results.data;
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  const response = await api.post<{results}>(`/notifications/read/`, {ids: [id]});
  return response.data.results;
};