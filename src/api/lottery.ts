import api from './axios';
import { Round } from '../types';

export const getEqubRounds = async (equbId: string): Promise<Round[]> => {
  const response = await api.get<Round[]>(`/equbs/${equbId}/rounds/`);
  return response.data;
};

export const drawLottery = async (equbId: string, roundNumber: number) => {
  return api.post(`/equbs/${equbId}/rounds/${roundNumber}/draw/`);
};

export const payoutLottery = async (equbId: string, roundNumber: number) => {
  return api.post(`/equbs/${equbId}/rounds/${roundNumber}/payout/`);
};
