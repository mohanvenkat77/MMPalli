import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLogVillageTransaction } from '../../hooks/useVillageMutations';
import { X, CheckCircle2, Loader2, IndianRupee, Plus } from 'lucide-react';
import { getCurrentFinancialYear } from '../../utils/financialYear';

export default function LogVillageTxnModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [party, setParty] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('CREDIT');
  const [category, setCategory] = useState('POND_AUCTION');
  const [desc, setDesc] = useState('');

  const { mutate, isPending, isSuccess, isError, error, reset } = useLogVillageTransaction();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentFinancialYear = getCurrentFinancialYear();

    const txnData = {
      party_name: party,
      amount: Number(amount),
      type: type,
      category: category,
      description: desc,
      financial_year: currentFinancialYear,
      payment_mode: 'CASH'
    };

    mutate(txnData);
  };

  const handleClose = () => {
    reset(); setParty(''); setAmount(''); setDesc(''); onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
            
            <div className="bg-trustBlue-900 p-8 text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl border border-white/20"><Plus size={24} /></div>
                <h2 className="text-2xl font-bold">Log Village Entry</h2>
              </div>
              <button onClick={handleClose} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"><X size={20} /></button>
            </div>

            <div className="p-8">
              {isSuccess ? (
                <div className="text-center py-10">
                  <CheckCircle2 size={80} className="text-emerald-500 mx-auto mb-6" />
                  <h3 className="text-3xl font-bold text-slate-900">Recorded!</h3>
                  <button onClick={handleClose} className="mt-8 w-full bg-slate-100 py-4 rounded-2xl font-bold text-slate-700">Done</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Party / Person Name</label>
                    <input required value={party} onChange={e => setParty(e.target.value)} placeholder="e.g. Raju Fisheries" className="w-full mt-2 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-trustBlue-500 outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Amount</label>
                      <div className="relative mt-2">
                        <IndianRupee size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input required type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-lg" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Type</label>
                      <select value={type} onChange={e => setType(e.target.value)} className="w-full mt-2 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold appearance-none">
                        <option value="CREDIT">Income (+)</option>
                        <option value="DEBIT">Expense (-)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="w-full mt-2 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold appearance-none">
                      <option value="POND_AUCTION">Pond Auction</option>
                      <option value="FESTIVAL_COLLECTION">Festival Donation</option>
                      <option value="GOVERNMENT_FUND">Govt Fund</option>
                      <option value="INFRASTRUCTURE">Infrastructure</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  {isError && <p className="text-red-500 font-bold text-center">{(error as any)?.response?.data?.message || 'Error occurred'}</p>}
                  <button disabled={isPending} className="w-full py-5 bg-trustBlue-900 text-white rounded-2xl font-bold text-lg hover:bg-trustBlue-800 transition-all flex justify-center items-center">
                    {isPending ? <Loader2 className="animate-spin" /> : 'Log Transaction'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
