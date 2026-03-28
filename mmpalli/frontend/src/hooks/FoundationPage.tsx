import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useFoundationSummary } from '../hooks/useFoundationSummary';
import StatCard from '../components/shared/StatCard';
// Added UserPlus to the import list below
import { Users, Wallet, TrendingUp, TrendingDown, Landmark, ArrowLeft, Download, FileText, Plus, UserPlus } from 'lucide-react';
import FoundationLedgerTable from '../components/foundation/FoundationLedgerTable';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LogFeeModal from '../components/admin/LogFeeModal';
import AddMemberModal from '../components/admin/AddMemberModal';

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function FoundationPage() {
  const { isAdmin } = useAuth(); 
  
  // CORRECT PLACEMENT: These must be inside the function
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false); 
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false); 

  const { data, isLoading, isError } = useFoundationSummary('2025-26');

  if (isLoading) return (
    <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-saffron-200 border-t-saffron-600 rounded-full animate-spin"></div>
    </div>
  );

  if (isError) return <div className="p-8 text-center text-red-500 mt-20">Failed to load data. Is your backend running?</div>;

  return (
    <div className="min-h-screen bg-[#FAFAF9] selection:bg-saffron-500 selection:text-white pb-24 font-sans overflow-hidden">
      
      {/* 1. HERO HEADER */}
      <div className="relative pt-8 pb-32 lg:pb-40 overflow-hidden bg-trustBlue-900 shadow-inner">
        {/* Background Orbs */}
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-[50%] right-[0%] w-[50vw] h-[50vw] rounded-full bg-saffron-500/30 blur-[100px]" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-[20%] -left-[10%] w-[40vw] h-[40vw] rounded-full bg-emerald-500/20 blur-[100px]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI24pIi8+PC9zdmc+')] opacity-[0.03] mix-blend-overlay"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Link to="/" className="inline-flex items-center text-trustBlue-200 hover:text-white transition-colors mb-10 font-medium group">
            <ArrowLeft size={20} className="mr-2 transition-transform group-hover:-translate-x-1" /> Back to Home
          </Link>
          
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <motion.div variants={fadeInUp} className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-saffron-300 text-sm font-semibold tracking-wider mb-4 shadow-sm">
                FINANCIAL YEAR 2025-26
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
                Jai Bheem <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-400 to-yellow-200">Foundation</span>
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-trustBlue-100 text-lg mt-4 max-w-xl leading-relaxed border-l-2 border-saffron-500 pl-4 opacity-90">
                Transparent financial ledger for member contributions and monthly fees.
              </motion.p>
            </div>

            {/* Action Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              {isAdmin && (
                <div className="flex gap-4">
                  <button 
                    onClick={() => setIsMemberModalOpen(true)}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md px-6 py-3 rounded-xl font-bold flex items-center transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <UserPlus size={20} className="mr-2" /> Add Member
                  </button>
                  <button 
                    onClick={() => setIsFeeModalOpen(true)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 px-6 py-3 rounded-xl font-bold flex items-center transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <Plus size={20} className="mr-2" /> Log Monthly Fee
                  </button>
                </div>
              )}
              <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-xl font-semibold flex items-center transition-all">
                <Download size={18} className="mr-2" /> Export
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* 2. MAIN DASHBOARD CONTENT */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 lg:-mt-20">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <motion.div variants={fadeInUp}><StatCard title="Total Balance" value={data?.balance || 0} icon={<Landmark size={28} />} isCurrency /></motion.div>
          <motion.div variants={fadeInUp}><StatCard title="Total Income" value={data?.total_income || 0} icon={<TrendingUp size={28} />} isCurrency trend="All collections" /></motion.div>
          <motion.div variants={fadeInUp}><StatCard title="Total Expenses" value={data?.total_expenses || 0} icon={<TrendingDown size={28} />} isCurrency /></motion.div>
          <motion.div variants={fadeInUp}><StatCard title="Active Members" value={data?.total_members || 0} icon={<Users size={28} />} /></motion.div>
          <motion.div variants={fadeInUp}><StatCard title="Membership Fees" value={data?.membership_fees || 0} icon={<Wallet size={28} />} isCurrency /></motion.div>
          <motion.div variants={fadeInUp}><StatCard title="Monthly Fees" value={data?.monthly_fees || 0} icon={<Wallet size={28} />} isCurrency /></motion.div>
        </motion.div>

        {/* 3. LEDGER TABLE */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-12 bg-white/80 backdrop-blur-2xl border border-white shadow-sm rounded-[2rem] p-8 min-h-[400px]">
          <FoundationLedgerTable />
        </motion.div>

        {/* --- MODAL COMPONENTS --- */}
        <LogFeeModal isOpen={isFeeModalOpen} onClose={() => setIsFeeModalOpen(false)} />
        <AddMemberModal isOpen={isMemberModalOpen} onClose={() => setIsMemberModalOpen(false)} />

      </div>
    </div>
  );
}