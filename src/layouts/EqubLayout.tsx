
import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useParams, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import StatusBadge from '../components/StatusBadge';
import { getEqub } from '../api/equbs';
import { Equb } from '../types';

const EqubLayout: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [equb, setEqub] = useState<Equb | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getEqub(id)
        .then(setEqub)
        .catch(() => {
          // If fetch fails, redirect to list
          navigate('/equbs');
        })
        .finally(() => setIsLoading(false));
    }
  }, [id, navigate]);

  if (isLoading) return <Loader />;
  if (!equb) return null;

  const tabs = [
    { name: 'Overview', path: '.', end: true },
    { name: 'Members', path: 'members' },
    { name: 'Payments', path: 'payments' },
    { name: 'Lottery', path: 'lottery' },
    { name: 'Reports', path: 'reports' },
    { name: 'Activity', path: 'activity' },
  ];

  return (
    <div className="space-y-6">
      {/* Equb Context Header */}
      <div className="rounded-3xl bg-white border border-slate-100 shadow-soft overflow-hidden">
        <div className="p-6 md:p-8 bg-slate-50/50 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-slate-900">{equb.name}</h1>
                <StatusBadge status={equb.status} />
              </div>
              <p className="text-slate-500 text-sm">
                {Number(equb.contribution_amount).toLocaleString()} ETB • {equb.equb_type.name} contribution
              </p>
            </div>
            {/* Quick Stats or Actions could go here */}
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="px-6 md:px-8 border-b border-slate-100 flex overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.end}
              className={({ isActive }) => `
                mr-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap
                ${isActive 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
              `}
            >
              {tab.name}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Page Content */}
      <div className="animate-fadeIn">
        <Outlet />
      </div>
    </div>
  );
};

export default EqubLayout;
