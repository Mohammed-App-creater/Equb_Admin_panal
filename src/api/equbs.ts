import api from './axios';
import { Equb, DashboardSummary } from '../types';

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  
  const response = await api.get<DashboardSummary>('/dashboard/');
  return response.data;
};

export const getEqubs = async (): Promise<{results: Equb[]}> => {
  const response = await api.get<{results: Equb[]}>('/equbs/');
  return response.data;
};

export const getEqub = async (id: string): Promise<{results: Equb}> => {
  const response = await api.get<{results: Equb}>(`/equbs/${id}/`);
  return response.data;
};

export const createEqub = async (data: Partial<Equb>): Promise<Equb> => {
  const response = await api.post<Equb>('/equbs/', data);
  return response.data;
};

export const updateEqub = async (id: string, data: Partial<Equb>): Promise<Equb> => {
  const response = await api.put<Equb>(`/equbs/${id}/`, data);
  return response.data;
};

export const deleteEqub = async (id: string): Promise<void> => {
  await api.delete(`/equbs/${id}/`);
};
