import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLogMonthlyFee } from '../../hooks/useAdminMutations';
import { X, Receipt, CheckCircle2, Loader2, IndianRupee } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogFeeModal({ isOpen, onClose }: Props) {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('100');
  const [paymentMode, setPaymentMode] = useState('UPI');

  const { mutate, isPending, isSuccess, isError, error, reset } = useLogMonthlyFee();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ phone_number: phone, amount: Number(amount), payment_mode: paymentMode, description: 'Monthly Fee' });
  };

  const handleClose = () => {
    reset(); // Clear success/error states
    setPhone('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="bg-slate-50 border-b border-slate-100 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-saffron-100 text-saffron-600 rounded-lg"><Receipt size={24} /></div>
                <h2 className="text-xl font-bold text-slate-900">Log Monthly Fee</h2>
              </div>
              <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors"><X size={20} /></button>
            </div>

            <div className="p-6">
              {isSuccess ? (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle2 size={64} className="text-emerald-500 mb-4" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Payment Logged!</h3>
                  <p className="text-slate-500 mb-6">The foundation ledger has been updated.</p>
                  <button onClick={handleClose} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors">Close Window</button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Phone Input */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Member Phone Number</label>
                    <input type="text" required pattern="[6-9][0-9]{9}" placeholder="e.g. 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 outline-none transition-all" />
                  </div>

                  {/* Amount & Mode */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Amount</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><IndianRupee size={16} className="text-slate-400" /></div>
                        <input type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 outline-none transition-all font-semibold" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Payment Mode</label>
                      <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 outline-none transition-all font-semibold appearance-none">
                        <option value="UPI">UPI</option>
                        <option value="CASH">Cash</option>
                        <option value="BANK_TRANSFER">Bank Transfer</option>
                      </select>
                    </div>
                  </div>

                 {isError && <p className="text-red-500 text-sm font-medium">{(error as any)?.response?.data?.message || 'Failed to log payment.'}</p>}

                  <button type="submit" disabled={isPending} className="w-full mt-4 bg-trustBlue-900 hover:bg-trustBlue-800 disabled:bg-trustBlue-900/50 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center transition-colors">
                    {isPending ? <Loader2 className="animate-spin" /> : 'Confirm Payment'}
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