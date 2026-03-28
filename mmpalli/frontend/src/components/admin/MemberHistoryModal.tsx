import { motion, AnimatePresence } from 'framer-motion';
import { X, Receipt, IndianRupee, ArrowDownCircle } from 'lucide-react';

export default function MemberHistoryModal({ isOpen, onClose, member }: any) {
  if (!member) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <motion.div 
            initial={{ y: "100%" }} 
            animate={{ y: 0 }} 
            exit={{ y: "100%" }}
            className="relative w-full max-w-2xl bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="p-8 bg-trustBlue-900 text-white flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-2xl font-bold">{member.full_name}'s Ledger</h2>
                <p className="text-trustBlue-200 text-sm">Full transaction history</p>
              </div>
              <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20"><X /></button>
            </div>

            <div className="p-6 overflow-y-auto bg-slate-50">
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Given</p>
                  <p className="text-2xl font-black text-emerald-600">₹{member.total_contributed || 0}</p>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status</p>
                  <p className="text-2xl font-black text-trustBlue-600">Active</p>
                </div>
              </div>

              <h3 className="font-bold text-slate-900 mb-4 px-2">History</h3>
              <div className="space-y-3">
                {member.transactions?.length > 0 ? (
                  member.transactions.sort((a:any, b:any) => new Date(b.txn_date).getTime() - new Date(a.txn_date).getTime()).map((txn: any) => (
                    <div key={txn._id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-trustBlue-200 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><ArrowDownCircle size={20} /></div>
                        <div>
                          <p className="font-bold text-slate-800">{txn.category?.replace('_', ' ')}</p>
                          <p className="text-xs text-slate-400">{new Date(txn.txn_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-slate-900 text-lg">₹{txn.amount}</p>
                        <p className="text-[10px] text-slate-300 font-mono uppercase">{txn.payment_mode}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-10 text-slate-400 italic">No transactions found for this member.</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}