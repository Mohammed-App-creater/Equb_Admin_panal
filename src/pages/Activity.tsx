
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import ActivityItem, { ActivityLog } from '../components/ActivityItem';
import { getEqubActivity } from '../api/activity';

const Activity: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getEqubActivity(id).then(setLogs).finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Activity Log</h2>
        <p className="text-muted-foreground">Audit trail for all administrative actions taken in this Equb.</p>
      </div>

      <div className="bg-card rounded-3xl p-6 border border-border shadow-soft">
        {logs.length === 0 ? (
          <EmptyState title="No Activity" description="There hasn't been any recorded activity for this Equb yet." />
        ) : (
          <div className="divide-y divide-border">
            {logs.map(log => (
              <ActivityItem key={log.id} log={log} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Activity;
