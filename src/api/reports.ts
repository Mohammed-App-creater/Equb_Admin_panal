
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

export const downloadReportCsv = async (equbId: string): Promise<Blob> => {
  const response = await api.get(`/equbs/${equbId}/export/`, {
    responseType: 'blob'
  });

  return response.data;
};
