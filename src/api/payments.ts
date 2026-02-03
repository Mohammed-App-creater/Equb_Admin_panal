
import api from './axios';
import { Payment } from '../types';

export const getEqubPayments = async (equbId: string): Promise<Payment[]> => {
  const response = await api.get<Payment[]>(`/equbs/${equbId}/payments/`);
  return response.data;
};

export const approvePayment = async (equbId: string, paymentId: string) => {
  return api.post(`/equbs/${equbId}/payments/${paymentId}/approve/`);
};

export const rejectPayment = async (equbId: string, paymentId: string) => {
  return api.post(`/equbs/${equbId}/payments/${paymentId}/reject/`);
};

export const recordManualPayment = async (equbId: string, formData: FormData) => {
  return api.post(`/equbs/${equbId}/payments/record/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
