
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
import { getEqubReportSummary, downloadReport , ReportSummary } from '../api/reports';
import { Equb } from '../types';


const Reports: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ReportSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (id) {
      getEqubReportSummary(id).then(setData).finally(() => setIsLoading(false));
    }
  }, [id]);

  const exportCSV = async () => {
    if (!id) return;
    setIsDownloading(true);
    try {
      const blob = await downloadReport(id, 'payments');
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `equb_report_${id}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Failed to download CSV", error);
      alert("Failed to download report.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) return <Loader />;
  if (!data) return <EmptyState title="No Data Available" description="We couldn't find any report data for this Equb." />;

  const collectionRate = data.expectedAmount > 0 
    ? (data.collectedAmount / data.expectedAmount) * 100 
    : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Financial Reports</h2>
          <p className="text-muted-foreground">Comprehensive overview of contributions and health.</p>
        </div>
        <button 
          onClick={exportCSV}
          disabled={isDownloading}
          className="flex items-center gap-2 rounded-2xl bg-muted px-6 py-3 text-sm font-bold text-foreground border border-border hover:bg-muted/80 transition-all active:scale-95 disabled:opacity-50"
        >
          {isDownloading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/30 border-t-foreground" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          )}
          {isDownloading ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          label="Total Expected" 
          value={`${data.expectedAmount.toLocaleString()} ETB`} 
          icon={<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>}
        />
        <StatCard 
          label="Collected" 
          value={`${data.collectedAmount.toLocaleString()} ETB`} 
          icon={<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>}
          trend={{ value: `${collectionRate.toFixed(1)}%`, positive: true }}
        />
        <StatCard 
          label="Pending" 
          value={`${data.pendingAmount.toLocaleString()} ETB`} 
          icon={<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>}
        />
        <StatCard 
          label="Active Participants" 
          value={`${data.membersPaid} / ${data.totalMembers}`} 
          icon={<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>}
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="bg-card rounded-3xl p-8 border border-border shadow-soft">
          <h3 className="text-lg font-bold mb-6">Collection Performance</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-end">
               <div>
                 <p className="text-sm text-muted-foreground">Current Round Goal</p>
                 <p className="text-2xl font-black">{collectionRate.toFixed(1)}% REACHED</p>
               </div>
               <span className="text-emerald-500 font-bold text-sm">Target: 100%</span>
            </div>
            <div className="h-4 w-full rounded-full bg-muted overflow-hidden">
               <div 
                 className="h-full bg-primary transition-all duration-1000 ease-out" 
                 style={{ width: `${collectionRate}%` }}
               />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed italic">
              * Based on data from {data.membersPaid} members who successfully cleared their contributions for this cycle.
            </p>
          </div>
        </div>

        <div className="bg-card rounded-3xl p-8 border border-border shadow-soft">
          <h3 className="text-lg font-bold mb-4">Round Progress</h3>
          <div className="flex items-center justify-center p-8">
             <div className="relative h-48 w-48 flex items-center justify-center">
               <svg className="h-full w-full rotate-[-90deg]">
                  <circle cx="50%" cy="50%" r="45%" fill="none" stroke="currentColor" strokeWidth="10" className="text-muted" />
                  <circle cx="50%" cy="50%" r="45%" fill="none" stroke="currentColor" strokeWidth="10" 
                    strokeDasharray="283" strokeDashoffset={283 - (283 * collectionRate / 100)} 
                    className="text-primary transition-all duration-1000" />
               </svg>
               <div className="absolute text-center">
                 <p className="text-3xl font-black">{data.membersPaid}</p>
                 <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Paid</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
