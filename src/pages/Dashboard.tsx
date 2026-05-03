import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { getDashboardSummary, getEqubs } from '../api/equbs';
import { DashboardSummary, Equb } from '../types';

const statusStyle = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-emerald-100 text-emerald-700';
    case 'pending':
      return 'bg-amber-100 text-amber-700';
    case 'completed':
      return 'bg-slate-100 text-slate-600';
    case 'cancelled':
      return 'bg-red-100 text-red-600';
    default:
      return 'bg-slate-100 text-slate-600';
  }
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [equbs, setEqubs] = useState<Equb[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [equbsLoading, setEqubsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDashboardSummary().then(setSummary),
      getEqubs().then((data) => setEqubs(data ?? [])),
    ])
      .catch((err) => console.error('Failed to fetch dashboard data', err))
      .finally(() => {
        setIsLoading(false);
        setEqubsLoading(false);
      });
  }, []);

  if (isLoading) return <Loader />;
  if (!summary)
    return (
      <div className="p-8 text-center text-muted-foreground">
        Failed to load dashboard summary.
      </div>
    );

  const today = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const pendingMembers = summary.pending_members;
  const pendingPayments = summary.pending_payments;
  const previewEqubs = equbs.slice(0, 3);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* SECTION 1 — HEADER */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Welcome back 👋</h2>
          <p className="text-muted-foreground">{today}</p>
        </div>
        <button
          onClick={() => navigate('/equbs')}
          className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:opacity-90 active:scale-95"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          Create New Equb
        </button>
      </div>

      {/* SECTION 2 — STAT CARDS */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {/* Card 1 — Total Equbs */}
        <Card
          className="relative overflow-hidden cursor-pointer hover:shadow-md transition-all"
          onClick={() => navigate('/equbs')}
        >
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="6" cy="6" r="3" />
                <circle cx="18" cy="6" r="3" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="18" r="3" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-foreground">{summary.total_equbs}</p>
            <p className="text-sm font-medium text-muted-foreground mt-1">Total Equbs</p>
            <p className="text-xs mt-1 text-muted-foreground">Active saving circles</p>
          </div>
        </Card>

        {/* Card 2 — Pending Members */}
        <Card
          className="relative overflow-hidden cursor-pointer hover:shadow-md transition-all"
          onClick={() => navigate('/equbs')}
        >
          <div className="flex items-center justify-between">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                pendingMembers > 0
                  ? 'bg-amber-50 text-amber-600'
                  : 'bg-emerald-50 text-emerald-600'
              }`}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <polyline points="16 11 18 13 22 9" />
              </svg>
            </div>
          </div>
          {pendingMembers > 0 && (
            <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          )}
          <div className="mt-4">
            <p className="text-3xl font-bold text-foreground">{pendingMembers}</p>
            <p className="text-sm font-medium text-muted-foreground mt-1">Pending Members</p>
            <p
              className={`text-xs mt-1 ${
                pendingMembers > 0 ? 'text-amber-600' : 'text-emerald-500'
              }`}
            >
              {pendingMembers > 0 ? `${pendingMembers} awaiting approval` : 'All caught up'}
            </p>
          </div>
        </Card>

        {/* Card 3 — Pending Payments */}
        <Card
          className="relative overflow-hidden cursor-pointer hover:shadow-md transition-all"
          onClick={() => navigate('/equbs')}
        >
          <div className="flex items-center justify-between">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                pendingPayments > 0
                  ? 'bg-amber-50 text-amber-600'
                  : 'bg-emerald-50 text-emerald-600'
              }`}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="6" width="20" height="14" rx="2" />
                <line x1="2" y1="11" x2="22" y2="11" />
              </svg>
            </div>
          </div>
          {pendingPayments > 0 && (
            <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          )}
          <div className="mt-4">
            <p className="text-3xl font-bold text-foreground">{pendingPayments}</p>
            <p className="text-sm font-medium text-muted-foreground mt-1">Pending Payments</p>
            <p
              className={`text-xs mt-1 ${
                pendingPayments > 0 ? 'text-amber-600' : 'text-emerald-500'
              }`}
            >
              {pendingPayments > 0 ? `${pendingPayments} awaiting approval` : 'All caught up'}
            </p>
          </div>
        </Card>
      </div>

      {/* SECTION 3 — TWO COLUMN LAYOUT */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* LEFT — Your Equbs (col-span-2) */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">Your Equbs</h3>
              <button
                onClick={() => navigate('/equbs')}
                className="text-sm text-primary hover:underline"
              >
                View all →
              </button>
            </div>

            {equbsLoading ? (
              <>
                <div className="h-14 rounded-xl bg-muted animate-pulse mb-2" />
                <div className="h-14 rounded-xl bg-muted animate-pulse mb-2" />
                <div className="h-14 rounded-xl bg-muted animate-pulse mb-2" />
              </>
            ) : previewEqubs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <svg
                  className="w-12 h-12 text-muted-foreground mb-3"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <circle cx="6" cy="6" r="3" />
                  <circle cx="18" cy="6" r="3" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="18" r="3" />
                </svg>
                <h4 className="font-bold text-foreground mb-1">No equbs yet</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first equb to get started
                </p>
                <button
                  onClick={() => navigate('/equbs')}
                  className="rounded-xl bg-primary text-white px-4 py-2 text-sm font-semibold hover:opacity-90 transition-all"
                >
                  Create Equb
                </button>
              </div>
            ) : (
              previewEqubs.map((equb) => (
                <div
                  key={equb.id}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0 hover:bg-muted/50 rounded-xl px-3 -mx-3 transition-colors cursor-pointer"
                  onClick={() => navigate(`/equbs/${equb.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                      {equb.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{equb.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {equb.equb_type?.name ?? 'Equb'} • {equb.total_members} members
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusStyle(
                        equb.status
                      )}`}
                    >
                      {equb.status}
                    </span>
                    <span className="text-sm font-bold text-foreground ml-3">
                      ETB {Number(equb.contribution_amount || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </Card>
        </div>

        {/* RIGHT — Action Center */}
        <Card title="Action Center">
          <div
            className="flex items-center justify-between p-3 rounded-xl bg-muted/60 mb-3 cursor-pointer hover:bg-muted transition-colors"
            onClick={() => navigate('/equbs')}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">Pending Members</p>
                <p className="text-xs text-muted-foreground">{pendingMembers} need approval</p>
              </div>
            </div>
            {pendingMembers > 0 ? (
              <span className="bg-amber-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                {pendingMembers}
              </span>
            ) : (
              <span className="text-emerald-500">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            )}
          </div>

          <div
            className="flex items-center justify-between p-3 rounded-xl bg-muted/60 mb-3 cursor-pointer hover:bg-muted transition-colors"
            onClick={() => navigate('/equbs')}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="6" width="20" height="14" rx="2" />
                  <line x1="2" y1="11" x2="22" y2="11" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">Pending Payments</p>
                <p className="text-xs text-muted-foreground">{pendingPayments} need approval</p>
              </div>
            </div>
            {pendingPayments > 0 ? (
              <span className="bg-amber-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                {pendingPayments}
              </span>
            ) : (
              <span className="text-emerald-500">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            )}
          </div>

          <hr className="my-4 border-border" />

          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Quick Actions
          </p>

          <button
            onClick={() => navigate('/equbs')}
            className="rounded-xl bg-primary text-white text-sm font-semibold py-2.5 w-full mb-2 hover:opacity-90 transition-all"
          >
            Manage Equbs
          </button>
          <button
            onClick={() => navigate('/reports')}
            className="rounded-xl border border-border text-foreground text-sm font-semibold py-2.5 w-full mb-2 hover:bg-muted transition-all"
          >
            View Reports
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="rounded-xl border border-border text-foreground text-sm font-semibold py-2.5 w-full hover:bg-muted transition-all"
          >
            Settings
          </button>
        </Card>
      </div>

      {/* SECTION 4 — BOTTOM BANNER */}
      <div
        className="rounded-3xl p-8 text-white"
        style={{
          background: 'linear-gradient(to right, hsl(243.4 75.4% 58.6%), #4338ca)',
        }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-white">Ready to run your next draw?</h3>
            <p className="text-white/70 text-sm mt-1">
              Make sure all members have paid before initiating the lottery draw.
            </p>
          </div>
          <button
            onClick={() => navigate('/equbs')}
            className="rounded-2xl bg-white text-primary font-bold px-6 py-3 text-sm hover:bg-white/90 transition-all active:scale-95 whitespace-nowrap"
          >
            Go to Lottery →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
