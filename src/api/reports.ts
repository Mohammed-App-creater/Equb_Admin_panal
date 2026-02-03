
import api from './axios';

export interface ReportSummary {
  expectedAmount: number;
  collectedAmount: number;
  pendingAmount: number;
  membersPaid: number;
  totalMembers: number;
}

export const getEqubReportSummary = async (equbId: string): Promise<ReportSummary> => {
  const response = await api.get<ReportSummary>(`/equbs/${equbId}/reports/`);
  return response.data;
};

export const downloadReport = async (equbId: string, type: string = 'payments'): Promise<Blob> => {
  const response = await api.get(`/equbs/${equbId}/export/?type=${type}`, {
    responseType: 'blob'
  });
  
  return response.data;
};
