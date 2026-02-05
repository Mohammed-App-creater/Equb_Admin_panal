import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Loader from "../components/Loader";
import StatusBadge from "../components/StatusBadge";
import {
  getEqubs,
  createEqub,
  getEqubCategories,
  getEqubTypes,
} from "../api/equbs";
import { Equb, EqubType, EqubCategory } from "../types";
import {
  createEqubSchema,
  step1Schema,
  step2Schema,
  step3Schema,
} from "../schemas/equb";
import toast from "react-hot-toast";

const Equbs: React.FC = () => {
  const navigate = useNavigate();
  const [equbs, setEqubs] = useState<Equb[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [equbTypes, setEqubTypes] = useState<EqubType[]>([]);
  const [equbCategories, setEqubCategories] = useState<EqubCategory[]>([]);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [newEqub, setNewEqub] = useState({
    name: "",
    contribution_amount: "",
    total_members: 10,
    category: "",
    equb_type: "",
    payout_system: "random" as const,
    start_date: "",
    end_date: "",
    rules: "",
  });

  useEffect(() => {
    fetchEqubs();
    fetchEqubTypes();
    fetchEqubCategories();
  }, []);

  useEffect(() => {
    if (!isModalOpen) {
      setStep(1);
      setNewEqub({
        name: "",
        contribution_amount: "",
        total_members: 10,
        category: "",
        equb_type: "",
        payout_system: "random",
        start_date: "",
        end_date: "",
        rules: "",
      });
      setErrors({});
    }
  }, [isModalOpen]);

  const fetchEqubs = async () => {
    setIsLoading(true);
    try {
      const data = await getEqubs();
      setEqubs(data);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEqubTypes = async () => {
    try {
      const types = await getEqubTypes();
      setEqubTypes(types);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEqubCategories = async () => {
    try {
      const categories = await getEqubCategories();
      setEqubCategories(categories);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(3)) {
      new Error("Validation failed");
    }

    setIsCreating(true);

    try {
      const payload = createEqubSchema.parse({
        ...newEqub,
        contribution_amount: Number(newEqub.contribution_amount),
        total_members: Number(newEqub.total_members),
      });

      const created = await createEqub({
        ...payload,
        equb_type: newEqub.equb_type || null,
      });

      setEqubs((prev) => [created, ...prev]);
      setIsModalOpen(false);
      toast.success("Equb created successfully.");
    } catch (err: any) {
      console.error("Error creating Equb:", err);
      if (err?.errors) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((e: any) => {
          fieldErrors[e.path[0]] = e.message;
        });
        setErrors(fieldErrors);
      }
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.detail ||
          "Failed to create Equb. Please try again."
      );
    } finally {
      setIsCreating(false);
    }
  };

  const clearErrors = () => setErrors({});

  const validateStep = (step: number) => {
    try {
      const data = {
        ...newEqub,
        contribution_amount: Number(newEqub.contribution_amount) || 0,
        total_members: Number(newEqub.total_members),
      };

      if (step === 1) step1Schema.parse(data);
      if (step === 2) step2Schema.parse(data);
      if (step === 3) step3Schema.parse(data);

      setErrors({});
      return true;
    } catch (err: any) {
      if (err?.issues) {
        const fieldErrors: Record<string, string> = {};

        err.issues.forEach((e: any) => {
          const field = e.path[0];
          fieldErrors[field] = e.message;
        });

        setErrors(fieldErrors);
      } else {
        console.error("Validation error:", err);
      }

      return false;
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
                    Created {new Date(equb.created_at).toLocaleDateString()}
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
                    {Number(equb?.contribution_amount || 0).toLocaleString()}{" "}
                    ETB
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Cycle
                  </p>
                  <p className="text-sm font-bold text-foreground capitalize">
                    {Math.floor(
                      Number(equb.total_payout || 0) /
                        Number(equb.contribution_amount || 1)
                    )}
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
            {/* Header */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-foreground">
                New Equb Circle
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Step {step} of 3
              </p>
            </div>

            <form onSubmit={handleCreate} className="space-y-6">
              {/* ================= STEP 1 ================= */}
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Equb Name *
                    </label>
                    <input
                      required
                      placeholder="Enter a name for your Equb"
                      className="w-full rounded-2xl bg-background px-4 py-3.5 border border-input focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      value={newEqub.name}
                      onChange={(e) => {
                        setNewEqub({ ...newEqub, name: e.target.value });
                        if (errors.name) {
                          const newErrors = { ...errors };
                          delete newErrors.name;
                          setErrors(newErrors);
                        }
                      }}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Contribution Amount *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <input
                        type="number"
                        required
                        min="1"
                        placeholder="0.00"
                        className="w-full rounded-2xl bg-background pl-10 pr-4 py-3.5 border border-input focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        value={newEqub.contribution_amount}
                        onChange={(e) => {
                          setNewEqub({
                            ...newEqub,
                            contribution_amount: e.target.value,
                          });
                          if (errors.contribution_amount) {
                            const newErrors = { ...errors };
                            delete newErrors.contribution_amount;
                            setErrors(newErrors);
                          }
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Amount each member will contribute per cycle
                    </p>
                    {errors.contribution_amount && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.contribution_amount}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Total Members *
                    </label>
                    <input
                      type="number"
                      required
                      min={2}
                      max={50}
                      placeholder="Number of members"
                      className="w-full rounded-2xl bg-background px-4 py-3.5 border border-input focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      value={newEqub.total_members}
                      onChange={(e) => {
                        setNewEqub({
                          ...newEqub,
                          total_members: Number(e.target.value) || 0,
                        });
                        if (errors.total_members) {
                          const newErrors = { ...errors };
                          delete newErrors.total_members;
                          setErrors(newErrors);
                        }
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      Minimum 2 members required
                    </p>
                    {errors.total_members && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.total_members}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* ================= STEP 2 ================= */}
              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Category *
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={newEqub.category}
                        onChange={(e) => {
                          setNewEqub({ ...newEqub, category: e.target.value });
                          if (errors.category) {
                            const newErrors = { ...errors };
                            delete newErrors.category;
                            setErrors(newErrors);
                          }
                        }}
                        className="w-full rounded-2xl bg-background px-4 py-3.5 border border-input focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Select a category</option>
                        {equbCategories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    {errors.category && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.category}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Type *
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={newEqub.equb_type}
                        onChange={(e) => {
                          setNewEqub({ ...newEqub, equb_type: e.target.value });
                          if (errors.equb_type) {
                            const newErrors = { ...errors };
                            delete newErrors.equb_type;
                            setErrors(newErrors);
                          }
                        }}
                        className="w-full rounded-2xl bg-background px-4 py-3.5 border border-input focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Select a Type</option>
                        {equbTypes.map((type) => (
                          <option className="py-3 border-t border-gray-100 first:border-t-0" key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    {errors.equb_type && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.equb_type}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Payout System *
                    </label>
                    <div className="relative">
                      <select
                        value={newEqub.payout_system}
                        onChange={(e) => {
                          setNewEqub({
                            ...newEqub,
                            payout_system: e.target.value as any,
                          });
                          if (errors.payout_system) {
                            const newErrors = { ...errors };
                            delete newErrors.payout_system;
                            setErrors(newErrors);
                          }
                        }}
                        className="w-full rounded-2xl bg-background px-4 py-3.5 border border-input focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                      >
                        <option value="random">Random (Lottery)</option>
                        <option value="first_come_first_serve">
                          First Come First Serve
                        </option>
                        <option value="auction">Auction Bid</option>
                        <option value="fixed">Fixed Order</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      How members receive payouts
                    </p>
                    {errors.payout_system && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.payout_system}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={newEqub.start_date}
                        onChange={(e) => {
                          setNewEqub({
                            ...newEqub,
                            start_date: e.target.value,
                          });
                          if (errors.start_date) {
                            const newErrors = { ...errors };
                            delete newErrors.start_date;
                            setErrors(newErrors);
                          }
                        }}
                        className="w-full rounded-2xl bg-background px-4 py-3.5 border border-input focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                      {errors.start_date && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.start_date}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground">
                        End Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={newEqub.end_date}
                        onChange={(e) => {
                          setNewEqub({ ...newEqub, end_date: e.target.value });
                          if (errors.end_date) {
                            const newErrors = { ...errors };
                            delete newErrors.end_date;
                            setErrors(newErrors);
                          }
                        }}
                        className="w-full rounded-2xl bg-background px-4 py-3.5 border border-input focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                      {errors.end_date && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.end_date}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* ================= STEP 3 ================= */}
              {step === 3 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Rules & Guidelines *
                  </label>
                  <textarea
                    required
                    placeholder="Define the rules, payment deadlines, consequences for late payments, meeting schedules, etc."
                    value={newEqub.rules}
                    onChange={(e) => {
                      setNewEqub({ ...newEqub, rules: e.target.value });
                      if (errors.rules) {
                        const newErrors = { ...errors };
                        delete newErrors.rules;
                        setErrors(newErrors);
                      }
                    }}
                    rows={6}
                    className="w-full rounded-2xl bg-background px-4 py-3.5 border border-input focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Clear rules help ensure smooth operation of your Equb
                  </p>
                  {errors.rules && (
                    <p className="text-xs text-red-500 mt-1">{errors.rules}</p>
                  )}
                </div>
              )}

              {/* ================= FOOTER BUTTONS ================= */}
              <div className="flex justify-between gap-4 pt-6">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      setStep((s) => (s - 1) as any);
                      clearErrors();
                    }}
                    className="w-full rounded-2xl bg-muted py-3.5 text-sm font-semibold hover:bg-muted/80 transition-colors"
                  >
                    Back
                  </button>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep(step)) {
                        setStep((s) => (s + 1) as any);
                        clearErrors();
                      }
                    }}
                    className="w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-primary/20"
                  >
                    {isCreating ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="w-4 h-4 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Creating Equb...
                      </span>
                    ) : (
                      "Launch Equb Circle"
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Equbs;
