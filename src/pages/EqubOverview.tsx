
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import Loader from '../components/Loader';
import { getEqub } from '../api/equbs';
import { Equb } from '../types';

const EqubOverview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [equb, setEqub] = useState<Equb | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getEqub(id).then(setEqub).finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) return <Loader />;
  if (!equb) return <div className="text-center text-red-500">Equb not found.</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          label="Contribution" 
          value={`${equb.contribution_amount?.toLocaleString()} ETB`} 
          icon={<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>}
        />
        <StatCard 
          label="Members" 
          value={equb.total_members?.toString()} 
          icon={<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>}
        />
        <StatCard 
          label="Frequency" 
          value={equb?.equb_type?.name?.charAt(0).toUpperCase() + equb?.equb_type?.name?.slice(1)} 
          icon={<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Quick Actions">
          <div className="grid grid-cols-2 gap-4">
            <Link to="members" className="flex flex-col items-center justify-center p-4 bg-indigo-50 rounded-xl text-indigo-700 hover:bg-indigo-100 transition-colors">
              <span className="font-bold mb-1">Manage Members</span>
              <span className="text-xs opacity-70">Approve/Reject</span>
            </Link>
            <Link to="payments" className="flex flex-col items-center justify-center p-4 bg-emerald-50 rounded-xl text-emerald-700 hover:bg-emerald-100 transition-colors">
              <span className="font-bold mb-1">Payments</span>
              <span className="text-xs opacity-70">Review & Approve</span>
            </Link>
            <Link to="lottery" className="flex flex-col items-center justify-center p-4 bg-amber-50 rounded-xl text-amber-700 hover:bg-amber-100 transition-colors">
              <span className="font-bold mb-1">Draw Lottery</span>
              <span className="text-xs opacity-70">Execute Draw</span>
            </Link>
            <Link to="reports" className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors">
              <span className="font-bold mb-1">View Reports</span>
              <span className="text-xs opacity-70">Export Data</span>
            </Link>
          </div>
        </Card>

        <Card title="Equb Details">
          <div className="space-y-4">
            <div className="flex justify-between border-b border-slate-50 pb-2">
              <span className="text-sm text-slate-500">Created On</span>
              <span className="text-sm font-medium text-slate-900">{new Date(equb.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-2">
              <span className="text-sm text-slate-500">Status</span>
              <span className="text-sm font-medium capitalize text-slate-900">{equb.status}</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-2">
              <span className="text-sm text-slate-500">Total Pool per Round</span>
              <span className="text-sm font-bold text-slate-900">{equb?.total_payout} ETB</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EqubOverview;
