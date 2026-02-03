
import api from './axios';

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'alert' | 'info' | 'success';
}

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await api.get<Notification[]>('/notifications/');
  return response.data;
};
