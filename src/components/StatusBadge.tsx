
import React from 'react';
import { Status } from '../types';

const StatusBadge: React.FC<{ status: Status | string }> = ({ status }) => {
  const styles = {
    pending: 'bg-amber-50 text-amber-600 border-amber-100',
    approved: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    completed: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    rejected: 'bg-red-50 text-red-600 border-red-100',
    removed: 'bg-red-50 text-red-600 border-red-100',
    active: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  };

  const currentStyle = styles[status as keyof typeof styles] || styles.pending;

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold capitalize ${currentStyle}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
