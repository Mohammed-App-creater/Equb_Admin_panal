
import React from 'react';

export interface ActivityLog {
  id: string;
  type: 'approve_member' | 'approve_payment' | 'draw_lottery' | 'payout' | 'create_equb';
  performedBy: string;
  entityName: string;
  timestamp: string;
  metadata?: string;
}

const ActivityItem: React.FC<{ log: ActivityLog }> = ({ log }) => {
  const getIcon = () => {
    switch (log.type) {
      case 'approve_member': return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>;
      case 'approve_payment': return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>;
      case 'draw_lottery': return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="m16 10-4 4-4-4"></path></svg>;
      default: return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;
    }
  };

  const getColor = () => {
    switch (log.type) {
      case 'approve_member': return 'text-emerald-500 bg-emerald-500/10';
      case 'approve_payment': return 'text-primary bg-primary/10';
      case 'draw_lottery': return 'text-amber-500 bg-amber-500/10';
      default: return 'text-slate-500 bg-slate-500/10';
    }
  };

  return (
    <div className="flex gap-4 py-4 first:pt-0 last:pb-0">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${getColor()}`}>
        {getIcon()}
      </div>
      <div className="flex flex-1 flex-col justify-center">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">
            {log.performedBy} <span className="font-normal text-muted-foreground">performed</span> {log.type.replace('_', ' ')}
          </p>
          <span className="text-[10px] text-muted-foreground uppercase font-bold">{log.timestamp}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">Related: <span className="text-foreground font-medium">{log.entityName}</span></p>
      </div>
    </div>
  );
};

export default ActivityItem;
