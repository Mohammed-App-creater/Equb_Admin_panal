
import api from './axios';
import { ActivityLog } from '../components/ActivityItem';

export const getEqubActivity = async (equbId: string): Promise<ActivityLog[]> => {
  const response = await api.get<ActivityLog[]>(`/equbs/${equbId}/activity/`);
  return response.data;
};
