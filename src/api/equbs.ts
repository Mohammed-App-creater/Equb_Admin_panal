import api from './axios';
import { Equb, EqubCategory, EqubType, DashboardSummary, CreateEqub } from '../types';

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  
  const response = await api.get<DashboardSummary>('/dashboard/');
  return response.data;
};

export const getEqubs = async (): Promise<Equb[]> => {
  const response = await api.get<{results: Equb[]}>('/equbs/');
  return response.data?.results;
};

export const getEqub = async (id: string): Promise<Equb> => {
  const response = await api.get<Equb>(`/equbs/${id}/`);
  return response.data;
};

export const getEqubTypes = async (): Promise<EqubType[]> => {
  const response = await api.get<EqubType[]>('/equbs/types/');
  return response.data;
};

export const getEqubCategories = async (): Promise<EqubCategory[]> => {
  const response = await api.get<EqubCategory[]>('/equbs/categories/');
  return response.data;
};

export const createEqub = async (data: Partial<CreateEqub>): Promise<Equb> => {
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
