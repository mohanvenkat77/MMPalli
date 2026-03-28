import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAddMember } from '../../hooks/useAdminMutations';
import { X, UserPlus, CheckCircle2, Loader2, User, Phone } from 'lucide-react';

export default function AddMemberModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [fatherName, setFatherName] = useState('');
    const [fee, setFee] = useState('500');

    const { mutate, isPending, isSuccess, isError, error, reset } = useAddMember();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // We are explicitly naming the keys to match your backend exactly
    const memberData = {
      full_name: name,         // 'name' is your state variable, 'full_name' is what backend wants
      phone_number: phone,     // 'phone' is your state variable, 'phone_number' is what backend wants
      father_name: fatherName,
      join_date: new Date().toISOString(), // Adding this just in case
      payment_mode: 'CASH'     // Your backend controller mentions this
    };

    console.log("Sending Data:", memberData); // This will show in your console
    mutate(memberData);
  };

    const handleClose = () => {
        reset(); setName(''); setPhone(''); setFatherName(''); onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                    <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">

                        <div className="bg-saffron-500 p-8 text-white flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <UserPlus size={28} />
                                <h2 className="text-2xl font-bold">New Member</h2>
                            </div>
                            <button onClick={handleClose} className="bg-white/20 p-2 rounded-full hover:bg-white/30"><X size={20} /></button>
                        </div>

                        <div className="p-8">
                            {isSuccess ? (
                                <div className="text-center py-6">
                                    <CheckCircle2 size={70} className="text-emerald-500 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold">Member Registered!</h3>
                                    <button onClick={handleClose} className="mt-8 w-full bg-slate-100 py-4 rounded-2xl font-bold text-slate-700">Done</button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                        <div className="relative mt-1">
                                            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input required value={name} onChange={e => setName(e.target.value)} placeholder="Enter name" className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-saffron-500 outline-none" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                        <div className="relative mt-1">
                                            <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input required pattern="[6-9][0-9]{9}" value={phone} onChange={e => setPhone(e.target.value)} placeholder="10-digit mobile" className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-saffron-500 outline-none" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Father's Name</label>
                                        <input value={fatherName} onChange={e => setFatherName(e.target.value)} placeholder="Optional" className="w-full mt-1 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-saffron-500 outline-none" />
                                    </div>

                                    {/* Change .message to .error to match your specific backend controller */}
                                    {isError && (
                                        <p className="text-red-500 text-sm font-bold text-center bg-red-50 py-2 rounded-lg mt-2">
                                            {(error as any)?.response?.data?.error || (error as any)?.response?.data?.message || 'Failed to add'}
                                        </p>
                                    )}

                                    <button disabled={isPending} className="w-full py-4 mt-4 bg-saffron-500 text-white rounded-2xl font-bold text-lg hover:bg-saffron-600 shadow-lg shadow-saffron-500/30 transition-all flex justify-center items-center">
                                        {isPending ? <Loader2 className="animate-spin" /> : 'Register Member'}
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