
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../components/Card';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import { getEqubPayments, approvePayment, rejectPayment, recordManualPayment } from '../api/payments';
import { Payment } from '../types';

const Payments: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'completed' | 'rejected'>('pending');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  
  // Manual form state
  const [manualForm, setManualForm] = useState({
    memberId: '',
    amount: '',
    receipt: null as File | null
  });

  useEffect(() => {
    if (id) fetchPayments();
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

  const filteredPayments = payments.filter(p => p.status === activeTab);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // File Validation (10MB Limit)
    if (manualForm.receipt && manualForm.receipt.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB limit.");
      return;
    }

    const formData = new FormData();
    formData.append('memberId', manualForm.memberId);
    formData.append('amount', manualForm.amount);
    if (manualForm.receipt) formData.append('receipt', manualForm.receipt);

    try {
      await recordManualPayment(id!, formData);
      alert('Manual payment recorded successfully');
      setIsRecordModalOpen(false);
      setManualForm({ memberId: '', amount: '', receipt: null });
      fetchPayments();
    } catch (err) {
      alert('Failed to record payment. Please check inputs.');
    }
  };

  if (isLoading) return <Loader />;
    console.log("payments", payments?.[0]?.status == activeTab); 
    console.log("payments", filteredPayments);
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Payments & Collections</h2>
          <p className="text-slate-500">Track contributions and approve pending payments.</p>
        </div>
        <button 
          onClick={() => setIsRecordModalOpen(true)}
          className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-secondary active:scale-95"
        >
          Record Manual Payment
        </button>
      </div>

      <div className="flex gap-1 rounded-2xl bg-slate-100 p-1 w-fit">
        {['pending', 'completed', 'rejected'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
              activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'
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
            <Card key={p.id} className="flex flex-col sm:flex-row items-center justify-between gap-6 hover:translate-y-[-2px] transition-transform">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{p.equb_member}</h4>
                  <p className="text-xs text-slate-500">{p.paid_at} • {(p.payment_method === 'Bank' || p.payment_method === 'bank') ? 'Manual Record' : 'Online Payment'}</p>
                </div>
              </div>

              <div className="text-center sm:text-right w-full sm:w-auto">
                <p className="text-lg font-black text-slate-900">{p.amount.toLocaleString()} ETB</p>
                <div className="mt-1">
                   <StatusBadge status={p.status} />
                </div>
              </div>

              {p.status === 'pending' && (
                <div className="flex gap-2 w-full sm:w-auto">
                   <button 
                    onClick={() => {
                      if (window.confirm("Are you sure you want to approve this payment?")) {
                        approvePayment(id!, p.id).then(fetchPayments).catch(() => alert('Action failed'));
                      }
                    }}
                    className="flex-1 sm:flex-none rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-100 hover:opacity-90 active:scale-95"
                   >
                     Approve
                   </button>
                   <button 
                    onClick={() => {
                      if (window.confirm("Are you sure you want to reject this payment?")) {
                        rejectPayment(id!, p.id).then(fetchPayments).catch(() => alert('Action failed'));
                      }
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

      {/* Manual Payment Modal */}
      <Modal 
        isOpen={isRecordModalOpen} 
        onClose={() => setIsRecordModalOpen(false)} 
        title="Record Manual Payment"
      >
        <form onSubmit={handleManualSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Member ID / Name</label>
            <input 
              required
              className="w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all border"
              placeholder="e.g. m1"
              value={manualForm.memberId}
              onChange={(e) => setManualForm({...manualForm, memberId: e.target.value})}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Amount (ETB)</label>
            <input 
              required
              type="number"
              className="w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all border"
              placeholder="1000"
              value={manualForm.amount}
              onChange={(e) => setManualForm({...manualForm, amount: e.target.value})}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Receipt Image (Optional)</label>
            <div className="relative">
              <input 
                type="file" 
                accept="image/*,.pdf"
                className="w-full rounded-2xl border-dashed border-2 border-slate-200 bg-slate-50 p-6 text-sm text-slate-500 cursor-pointer hover:bg-slate-100 transition-colors"
                onChange={(e) => setManualForm({...manualForm, receipt: e.target.files?.[0] || null})}
              />
              <p className="text-xs text-slate-400 mt-2">Max 10MB.</p>
            </div>
          </div>
          <button type="submit" className="w-full rounded-2xl bg-primary py-4 font-bold text-white shadow-xl shadow-primary/20 hover:bg-secondary transition-all active:scale-95">
            Submit Record
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Payments;
