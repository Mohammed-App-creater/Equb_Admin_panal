
import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border-2 border-dashed border-border bg-card/50">
      <div className="mb-4 text-muted-foreground/30">
        {icon || (
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
        )}
      </div>
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-xs">{description}</p>
    </div>
  );
};

export default EmptyState;
