
import React from 'react';
import Card from './Card';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, trend }) => {
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-bold ${trend.positive ? 'text-emerald-500' : 'text-destructive'}`}>
            {trend.value}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
    </Card>
  );
};

export default StatCard;
