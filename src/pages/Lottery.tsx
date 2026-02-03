
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../components/Card';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import { getEqubRounds, drawLottery, payoutLottery } from '../api/lottery';
import { Round } from '../types';

const Lottery: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [rounds, setRounds] = useState<Round[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (id) fetchRounds();
  }, [id]);

  const fetchRounds = async () => {
    setIsLoading(true);
    try {
      const data = await getEqubRounds(id!);
      setRounds(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const currentRound = rounds.find(r => r.status === 'pending');

  const handleDraw = async () => {
    if (!currentRound || !id) return;
    setIsDrawing(true);
    try {
      await drawLottery(id, currentRound.roundNumber);
      alert(`Winner drawn for Round ${currentRound.roundNumber}!`);
      setIsConfirmOpen(false);
      fetchRounds();
    } catch (err) {
      alert('Draw failed. Ensure all members have paid for this round.');
    } finally {
      setIsDrawing(false);
    }
  };

  const handlePayout = async (roundNumber: number) => {
    if (!id) return;
    try {
      await payoutLottery(id, roundNumber);
      alert(`Payout completed for Round ${roundNumber}`);
      fetchRounds();
    } catch (err) {
      alert('Payout failed.');
    }
  };


  if (isLoading) return <Loader />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-slate-900">Lottery & Rounds</h2>
        <p className="text-slate-500">Conduct fair draws for your Equb participants.</p>
      </div>

      {currentRound && (
        <Card className="bg-gradient-to-br from-indigo-600 to-primary text-white border-0 shadow-2xl shadow-primary/30 p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
               <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                 Active Cycle
               </span>
               <h3 className="text-4xl font-black">Round {currentRound.roundNumber}</h3>
               <p className="text-indigo-100 max-w-sm">
                 All pending payments for this round must be approved before you can draw the winner.
               </p>
            </div>
            <button 
              onClick={() => setIsConfirmOpen(true)}
              className="group relative flex h-24 w-24 items-center justify-center rounded-full bg-white text-primary shadow-xl transition-all hover:scale-110 active:scale-95"
            >
              <div className="absolute inset-0 rounded-full border-4 border-white animate-ping opacity-20"></div>
              <span className="text-sm font-black uppercase">Draw</span>
            </button>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        <h4 className="text-lg font-bold text-slate-800">Round History</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rounds.map((round) => (
            <Card key={round.id} className={`${round.status === 'completed' ? 'border-l-4 border-l-emerald-500' : 'opacity-60 grayscale'}`}>
              <div className="flex items-start justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Round {round.roundNumber}</span>
                {round.status === 'completed' ? (
                   <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Completed</span>
                ) : (
                   <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Upcoming</span>
                )}
              </div>
              
              {round.winnerName ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Winner</p>
                    <p className="text-xl font-bold text-slate-900">{round.winnerName}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Draw Date</p>
                      <p className="text-sm font-medium text-slate-700">{round.drawDate}</p>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                       <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="py-4 text-sm text-slate-400 font-medium italic">Drawing soon...</p>
              )}
            </Card>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isConfirmOpen}
        onClose={() => !isDrawing && setIsConfirmOpen(false)}
        title="Final Confirmation"
        footer={
          <>
            <button 
              disabled={isDrawing}
              onClick={() => setIsConfirmOpen(false)}
              className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
            >
              Wait, Cancel
            </button>
            <button 
              disabled={isDrawing}
              onClick={handleDraw}
              className="bg-primary px-8 py-2 text-sm font-bold text-white rounded-xl shadow-lg shadow-primary/20 hover:bg-secondary active:scale-95 disabled:opacity-50"
            >
              {isDrawing ? 'Drawing...' : 'Draw Now'}
            </button>
          </>
        }
      >
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-4">
             <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2"><path d="m10.29 3.86 7.18 12.45a1 1 0 0 1-.87 1.5H3.4a1 1 0 0 1-.87-1.5l7.18-12.45a1 1 0 0 1 1.74 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </div>
          <p className="text-slate-900 font-bold text-lg">Are you absolutely sure?</p>
          <p className="text-slate-500 text-sm leading-relaxed">
            Starting the lottery draw for <strong className="text-slate-900 text-base">Round {currentRound?.roundNumber}</strong> is an irreversible action. 
            A winner will be randomly selected from all eligible participants who have cleared their payments.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Lottery;
