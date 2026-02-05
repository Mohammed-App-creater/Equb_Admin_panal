
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../components/Card';
import Loader from '../components/Loader';
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


  if (isLoading) return <Loader />;

  return (
    <div className="space-y-8">

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

    </div>
  );
};

export default Payments;
