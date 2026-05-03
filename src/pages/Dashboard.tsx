
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { getDashboardSummary } from '../api/equbs';
import { DashboardSummary } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getDashboardSummary();
        setSummary(data);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (isLoading) return <Loader />;
  if (!summary) return <div className="p-8 text-center text-slate-500">Failed to load dashboard summary.</div>;


  return (
    <div className="space-y-8 animate-fadeIn dark:text-slate-300">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
        <p className="text-slate-500">Here's what's happening with your Equb circles today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Equbs</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-300">{summary?.total_equbs || 0}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Members</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-300">{summary?.pending_members || 0}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Payments</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-300">{summary?.pending_payments || 0}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card title="Recent Activity">
            <div className="space-y-6 dark:text-slate-300">
              <div className="text-center py-8 text-slate-400">No recent activity</div>
            </div>
            <button
              onClick={() => navigate('/equbs')}
              className="mt-8 w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              View Full Audit Log
            </button>
          </Card>
        </div>

        {/* Quick Actions / Tips */}
        <div className="space-y-8">
          <Card className="bg-primary text-white" title="">
             <div className="flex flex-col gap-4">
               <h3 className="text-xl font-bold text-black dark:text-white">New Cycle Goal?</h3>
               <p className="text-primary-foreground/80 text-sm leading-relaxed text-gray-500">
                 Create a new Equb circle to help more members save consistently. You can choose daily, weekly, or monthly contributions.
               </p>
               <button
                 onClick={() => navigate('/equbs')}
                 className="mt-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-primary shadow-lg shadow-black/10 transition-transform active:scale-95"
               >
                 Launch New Equb
               </button>
             </div>
          </Card>

          <Card title="Pending Items">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Pending Members</span>
                <span className="text-sm font-bold text-slate-900">{summary?.pending_members || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Pending Payments</span>
                <span className="text-sm font-bold text-slate-900">{summary?.pending_payments || 0}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
