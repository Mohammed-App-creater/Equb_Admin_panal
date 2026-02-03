import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Loader from "../components/Loader";
import StatusBadge from "../components/StatusBadge";
import { getEqubs, createEqub } from "../api/equbs";
import { Equb } from "../types";

const Equbs: React.FC = () => {
  const navigate = useNavigate();
  const [equbs, setEqubs] = useState<Equb[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [newEqub, setNewEqub] = useState({
    name: "",
    contribution_amount: "",
    frequency: "weekly" as const,
  });

  useEffect(() => {
    fetchEqubs();
  }, []);

  const fetchEqubs = async () => {
    setIsLoading(true);
    try {
      const data = await getEqubs();
      setEqubs(data?.results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const created = await createEqub({
        name: newEqub.name,
        contribution_amount: newEqub.contribution_amount,
        frequency: newEqub.frequency,
      });
      setEqubs((prev) => [created, ...prev]);
      setIsModalOpen(false);
      setNewEqub({ name: "", contribution_amount: "", frequency: "weekly" });
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) return <Loader />;
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            My Equb Circles
          </h2>
          <p className="text-muted-foreground">
            Manage, track and monitor your active saving groups.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-secondary active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Create New Equb
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {equbs?.map((equb) => (
          <Card key={equb.id} className="relative overflow-hidden group">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {equb.name}
                  </h3>
                  <p className="text-xs font-medium text-muted-foreground">
                    Created {equb.created_at.slice(0, 10)}
                  </p>
                </div>
                <StatusBadge status={equb.status} />
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-xl bg-muted p-4 border border-border">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Amount
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {Number(equb?.contribution_amount).toLocaleString()} ETB
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Cycle
                  </p>
                  <p className="text-sm font-bold text-foreground capitalize">
                    {Number(equb.total_payout) / Number(equb.contribution_amount)}{" "}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2">
                <button
                  onClick={() => navigate(`/equbs/${equb.id}/members`)}
                  className="rounded-xl border border-border bg-card py-3 text-[10px] font-bold text-muted-foreground hover:border-primary hover:text-primary transition-all"
                >
                  Members
                </button>
                <button
                  onClick={() => navigate(`/equbs/${equb.id}/payments`)}
                  className="rounded-xl border border-border bg-card py-3 text-[10px] font-bold text-muted-foreground hover:border-primary hover:text-primary transition-all"
                >
                  Payments
                </button>
                <button
                  onClick={() => navigate(`/equbs/${equb.id}/lottery`)}
                  className="rounded-xl border border-border bg-card py-3 text-[10px] font-bold text-muted-foreground hover:border-primary hover:text-primary transition-all"
                >
                  Lottery
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigate(`/equbs/${equb.id}/reports`)}
                  className="rounded-xl bg-primary py-3 text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95 shadow-md shadow-primary/20"
                >
                  Reports
                </button>
                <button
                  onClick={() => navigate(`/equbs/${equb.id}/activity`)}
                  className="rounded-xl bg-muted py-3 text-xs font-bold text-foreground transition-all hover:opacity-90 active:scale-95 border border-border"
                >
                  Audit Log
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
          <div
            className="absolute inset-0 bg-background/40"
            onClick={() => !isCreating && setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-3xl bg-card border border-border shadow-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-foreground">
              New Equb Circle
            </h3>
            <form onSubmit={handleCreate} className="space-y-6">
              <input
                required
                placeholder="Equb Name"
                className="w-full rounded-2xl border-border bg-muted px-4 py-4 border outline-none text-foreground focus:ring-4 focus:ring-primary/10"
                value={newEqub.name}
                onChange={(e) =>
                  setNewEqub({ ...newEqub, name: e.target.value })
                }
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  required
                  placeholder="Amount"
                  className="w-full rounded-2xl border-border bg-muted px-4 py-4 border outline-none text-foreground focus:ring-4 focus:ring-primary/10"
                  value={newEqub.contribution_amount}
                  onChange={(e) =>
                    setNewEqub({
                      ...newEqub,
                      contribution_amount: e.target.value,
                    })
                  }
                />
                <select
                  className="w-full rounded-2xl border-border bg-muted px-4 py-4 border outline-none text-foreground focus:ring-4 focus:ring-primary/10"
                  value={newEqub.frequency}
                  onChange={(e) =>
                    setNewEqub({ ...newEqub, frequency: e.target.value as any })
                  }
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full rounded-2xl bg-primary py-4 text-sm font-bold text-white"
              >
                {isCreating ? "Creating..." : "Launch Equb"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Equbs;
