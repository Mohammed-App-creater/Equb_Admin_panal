import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../components/Card";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import StatusBadge from "../components/StatusBadge";
import {
  getEqubPayments,
  approvePayment,
  rejectPayment,
  recordManualPayment,
} from "../api/payments";
import { getEqubMembers } from "../api/members";
import ConfirmModal from "../components/PaymentConfirmModal";
import { Payment, Member } from "../types";
import toast from "react-hot-toast";

const Payments: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "pending" | "completed" | "rejected"
  >("pending");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null
  );

  const [members, setMembers] = useState<Member[]>([]);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);
  const [manualForm, setManualForm] = useState({
    equb_member: "",
    amount: "",
    round_number: "",
    payment_method: "bank" as "bank" | "telebirr" | "cash",
    receipt_image: null as File | null,
  });

  useEffect(() => {
    if (id) {
      fetchPayments();
      getEqubMembers(id).then(setMembers).catch(() => {});
    }
  }, [id]);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const data = await getEqubPayments(id!);
      setPayments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsSubmittingManual(true);
    try {
      const formData = new FormData();
      formData.append("equb_member", manualForm.equb_member);
      formData.append("amount", manualForm.amount);
      formData.append("round_number", manualForm.round_number);
      formData.append("payment_method", manualForm.payment_method);
      if (manualForm.receipt_image) {
        formData.append("receipt_image", manualForm.receipt_image);
      }
      await recordManualPayment(id, formData);
      toast.success("Payment recorded successfully.");
      setIsManualModalOpen(false);
      setManualForm({
        equb_member: "",
        amount: "",
        round_number: "",
        payment_method: "bank",
        receipt_image: null,
      });
      await fetchPayments();
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Failed to record payment.";
      toast.error(message);
    } finally {
      setIsSubmittingManual(false);
    }
  };

  const filteredPayments = payments.filter((p) => p.status === activeTab);

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Payments</h2>
          <p className="text-slate-500">Review, approve, and record payments for this Equb.</p>
        </div>
        <button
          onClick={() => setIsManualModalOpen(true)}
          className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-secondary active:scale-95"
        >
          Record Manual Payment
        </button>
      </div>

      <div className="flex gap-1 rounded-2xl bg-slate-100 p-1 w-fit">
        {["pending", "completed", "rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
              activeTab === tab
                ? "bg-white text-primary shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredPayments.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border-2 border-dashed border-slate-100">
            No {activeTab} payments found.
          </div>
        ) : (
          filteredPayments.map((p) => (
            <Card
              key={p.id}
              className="flex flex-col sm:flex-row items-center justify-between gap-6 hover:translate-y-[-2px] transition-transform"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{p.equb_member}</h4>
                  <p className="text-xs text-slate-500">
                    {p.paid_at} •{" "}
                    {p.payment_method === "Bank" || p.payment_method === "bank"
                      ? "Manual Record"
                      : "Online Payment"}
                  </p>
                </div>
              </div>

              <div className="text-center sm:text-right w-full sm:w-auto">
                <p className="text-lg font-black text-slate-900">
                  {p.amount.toLocaleString()} ETB
                </p>
                <div className="mt-1">
                  <StatusBadge status={p.status} />
                </div>
              </div>

              {p.status === "pending" && (
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setSelectedPayment(p);
                      setActionType("approve");
                      setConfirmOpen(true);
                    }}
                    className="flex-1 sm:flex-none rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-100 hover:opacity-90 active:scale-95"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPayment(p);
                      setActionType("reject");
                      setConfirmOpen(true);
                    }}
                    className="flex-1 sm:flex-none rounded-xl border border-red-200 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 active:scale-95"
                  >
                    Reject
                  </button>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
      <ConfirmModal
        isOpen={confirmOpen}
        title={actionType === "approve" ? "Approve Payment" : "Reject Payment"}
        message={
          actionType === "approve"
            ? "Are you sure you want to approve this payment?"
            : "Are you sure you want to reject this payment?"
        }
        confirmText={actionType === "approve" ? "Approve" : "Reject"}
        loading={actionLoading}
        onCancel={() => {
          setConfirmOpen(false);
          setSelectedPayment(null);
          setActionType(null);
        }}
        onConfirm={async () => {
          if (!selectedPayment || !actionType) return;

          setActionLoading(true);
          try {
            if (actionType === "approve") {
              await approvePayment(id!, selectedPayment.id);
            } else {
              await rejectPayment(id!, selectedPayment.id);
            }
            await fetchPayments();
            setConfirmOpen(false);
          } catch (err) {
            toast.error("Action failed. Please try again.");
          } finally {
            setActionLoading(false);
          }
        }}
      />

      <Modal
        isOpen={isManualModalOpen}
        onClose={() => !isSubmittingManual && setIsManualModalOpen(false)}
        title="Record Manual Payment"
        footer={
          <>
            <button
              type="button"
              disabled={isSubmittingManual}
              onClick={() => setIsManualModalOpen(false)}
              className="rounded-xl px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="manual-payment-form"
              disabled={isSubmittingManual}
              className="bg-primary px-6 py-2 text-sm font-bold text-white rounded-xl shadow-lg shadow-primary/20 hover:bg-secondary active:scale-95 disabled:opacity-50"
            >
              {isSubmittingManual ? "Recording..." : "Record Payment"}
            </button>
          </>
        }
      >
        <form id="manual-payment-form" onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Member *</label>
            <select
              required
              value={manualForm.equb_member}
              onChange={(e) => setManualForm({ ...manualForm, equb_member: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">Select a member</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.user_name} — {m.phone}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Amount (ETB) *</label>
            <input
              type="number"
              required
              min="1"
              value={manualForm.amount}
              onChange={(e) => setManualForm({ ...manualForm, amount: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Round Number *</label>
            <input
              type="number"
              required
              min="1"
              value={manualForm.round_number}
              onChange={(e) => setManualForm({ ...manualForm, round_number: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method *</label>
            <select
              required
              value={manualForm.payment_method}
              onChange={(e) => setManualForm({ ...manualForm, payment_method: e.target.value as "bank" | "telebirr" | "cash" })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="bank">Bank</option>
              <option value="telebirr">Telebirr</option>
              <option value="cash">Cash</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Receipt Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setManualForm({ ...manualForm, receipt_image: e.target.files?.[0] || null })}
              className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-bold file:text-slate-700 hover:file:bg-slate-200"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Payments;
