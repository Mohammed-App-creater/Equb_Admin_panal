
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { getEqubs } from '../api/equbs';
import { Equb } from '../types';

const ReportsList: React.FC = () => {
  const [equbs, setEqubs] = useState<Equb[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getEqubs()
      .then(setEqubs)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Select an Equb</h2>
        <p className="text-muted-foreground">Choose an Equb circle to view its detailed financial reports.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {equbs?.map((equb) => (
          <Card 
            key={equb.id} 
            className="cursor-pointer hover:border-primary/50 transition-all group"
            onClick={() => navigate(`/equbs/${equb.id}/reports`)}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{equb.name}</h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground group-hover:text-primary"><path d="M9 18l6-6-6-6"/></svg>
            </div>
            <p className="text-sm text-muted-foreground">
              {equb.frequency} • {equb.totalMembers} Members
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReportsList;
