
import api from './axios';
import { Member } from '../types';

export const getEqubMembers = async (equbId: string): Promise<{results: Member[]}> => {
  const response = await api.get<{results: Member[]}>(`/equbs/${equbId}/members/`);
  return response.data;
};

export const approveMember = async (equbId: string, memberId: string) => {
  return api.post(`/equbs/${equbId}/members/${memberId}/approve/`);
};

export const rejectMember = async (equbId: string, memberId: string) => {
  return api.post(`/equbs/${equbId}/members/${memberId}/reject/`);
};
