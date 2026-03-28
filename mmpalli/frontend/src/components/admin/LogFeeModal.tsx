import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLogMonthlyFee } from '../../hooks/useAdminMutations';
import { X, Receipt, CheckCircle2, Loader2, IndianRupee, Tag } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogFeeModal({ isOpen, onClose }: Props) {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('500');
  const [category, setCategory] = useState('MONTHLY_FEE'); // Category Tag State
  const [paymentMode, setPaymentMode] = useState('UPI');

  const { mutate, isPending, isSuccess, isError, error, reset } = useLogMonthlyFee();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ 
      phone_number: phone, 
      amount: Number(amount), 
      category: category, // Sending the chosen tag
      payment_mode: paymentMode, 
      description: `${category.replace('_', ' ')}` 
    });
  };

  const handleClose = () => {
    reset();
    setPhone('');
    setCategory('MONTHLY_FEE');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="bg-slate-50 border-b border-slate-100 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-saffron-100 text-saffron-600 rounded-lg"><Receipt size={24} /></div>
                <h2 className="text-xl font-bold text-slate-900">Log Contribution</h2>
              </div>
              <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 bg-white shadow-sm p-2 rounded-full transition-colors"><X size={20} /></button>
            </div>

            <div className="p-6">
              {isSuccess ? (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle2 size={64} className="text-emerald-500 mb-4" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Success!</h3>
                  <p className="text-slate-500 mb-6">The {category.replace('_', ' ').toLowerCase()} has been logged.</p>
                  <button onClick={handleClose} className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl transition-all shadow-lg">Close</button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Fee Type Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                        <Tag size={14} className="text-saffron-500" /> Fee Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        <button 
                            type="button"
                            onClick={() => setCategory('MONTHLY_FEE')}
                            className={`py-3 rounded-xl border-2 font-bold transition-all text-sm ${category === 'MONTHLY_FEE' ? 'border-saffron-500 bg-saffron-50 text-saffron-700' : 'border-slate-100 bg-slate-50 text-slate-400'}`}
                        >
                            Monthly Fee
                        </button>
                        <button 
                            type="button"
                            onClick={() => setCategory('MEMBERSHIP_FEE')}
                            className={`py-3 rounded-xl border-2 font-bold transition-all text-sm ${category === 'MEMBERSHIP_FEE' ? 'border-saffron-500 bg-saffron-50 text-saffron-700' : 'border-slate-100 bg-slate-50 text-slate-400'}`}
                        >
                            Membership Fee
                        </button>
                    </div>
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Member Phone</label>
                    <input type="text" required pattern="[6-9][0-9]{9}" placeholder="e.g. 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-saffron-500 outline-none transition-all font-medium" />
                  </div>

                  {/* Amount & Mode */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Amount</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><IndianRupee size={16} className="text-slate-400" /></div>
                        <input type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-saffron-500 outline-none transition-all font-bold" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Mode</label>
                      <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-saffron-500 outline-none transition-all font-bold appearance-none">
                        <option value="UPI">UPI</option>
                        <option value="CASH">Cash</option>
                        <option value="BANK">Bank</option>
                      </select>
                    </div>
                  </div>

                  {isError && (
                    <p className="bg-red-50 text-red-500 text-sm font-bold p-3 rounded-xl border border-red-100">
                        {(error as any)?.response?.data?.error || 'Validation failed. Check phone number.'}
                    </p>
                  )}

                  <button type="submit" disabled={isPending} className="w-full mt-4 bg-trustBlue-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold py-4 rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-trustBlue-900/20">
                    {isPending ? <Loader2 className="animate-spin" /> : 'Confirm & Save'}
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