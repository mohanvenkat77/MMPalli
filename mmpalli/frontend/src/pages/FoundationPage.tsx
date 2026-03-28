import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useFoundationSummary } from '../hooks/useFoundationSummary';
import StatCard from '../components/shared/StatCard';
import { 
  Users, Wallet, TrendingUp, TrendingDown, Landmark, 
  ArrowLeft, Download, Plus, UserPlus, CheckCircle 
} from 'lucide-react';
import FoundationLedgerTable from '../components/foundation/FoundationLedgerTable';
import ContributionMatrix from '../components/foundation/ContributionMatrix';
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
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  // FY 2025-26 set as current context
  const { data, isLoading, isError } = useFoundationSummary('2025-26');

  if (isLoading) return (
    <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-saffron-200 border-t-saffron-600 rounded-full animate-spin"></div>
    </div>
  );

  if (isError) return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-red-50 text-red-600 p-8 rounded-[2.5rem] border border-red-100 max-w-md shadow-xl">
        <h2 className="text-2xl font-bold mb-2">⚠️ Server Connection Lost</h2>
        <p className="opacity-80 mb-6">Failed to load foundation data. Please ensure your backend terminal is running on port 5000.</p>
        <button onClick={() => window.location.reload()} className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold">Try Again</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAF9] selection:bg-saffron-500 selection:text-white pb-24 font-sans overflow-hidden">

      {/* 1. HERO HEADER */}
      <div className="relative pt-8 pb-32 lg:pb-40 overflow-hidden bg-trustBlue-900 shadow-inner">
        {/* Animated Background Orbs */}
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-[50%] right-[0%] w-[50vw] h-[50vw] rounded-full bg-saffron-500/30 blur-[100px]" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-[20%] -left-[10%] w-[40vw] h-[40vw] rounded-full bg-emerald-500/20 blur-[100px]" />
        
        {/* Fixed Noise Background */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI24pIi8+PC9zdmc+')] opacity-[0.03] mix-blend-overlay"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Link to="/" className="inline-flex items-center text-trustBlue-200 hover:text-white transition-colors mb-10 font-medium group">
            <ArrowLeft size={20} className="mr-2 transition-transform group-hover:-translate-x-1" /> Back to Home
          </Link>

          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <motion.div variants={fadeInUp} className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-saffron-300 text-sm font-semibold tracking-wider mb-4 shadow-sm uppercase">
                Financial Year 2025-26
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
                Jai Bheem <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-400 to-yellow-200">Foundation</span>
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-trustBlue-100 text-lg mt-4 max-w-xl leading-relaxed border-l-2 border-saffron-500 pl-4 opacity-90">
                A high-transparency ledger tracking every member contribution and development expense for MatlaMala Palli.
              </motion.p>
            </div>

            {/* Action Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
              {isAdmin && (
                <>
                  <button
                    onClick={() => setIsMemberModalOpen(true)}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md px-5 py-3 rounded-xl font-bold flex items-center transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <UserPlus size={18} className="mr-2" /> Add Member
                  </button>

                  <Link
                    to="/members"
                    className="bg-saffron-500 hover:bg-saffron-600 text-white shadow-lg shadow-saffron-500/30 px-5 py-3 rounded-xl font-bold flex items-center transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <Users size={18} className="mr-2" /> Directory
                  </Link>

                  <Link
                    to="/bulk-collection"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30 px-5 py-3 rounded-xl font-bold flex items-center transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <CheckCircle size={18} className="mr-2" /> Bulk Collection
                  </Link>

                  <button
                    onClick={() => setIsFeeModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 px-5 py-3 rounded-xl font-bold flex items-center transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <Plus size={18} className="mr-2" /> Log Fee
                  </button>
                </>
              )}
              <button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-5 py-3 rounded-xl font-semibold flex items-center transition-all">
                <Download size={18} className="mr-2" /> Export CSV
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* 2. MAIN DASHBOARD CONTENT */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 lg:-mt-20">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <motion.div variants={fadeInUp}><StatCard title="Current Balance" value={data?.balance || 0} icon={<Landmark size={28} />} isCurrency /></motion.div>
          <motion.div variants={fadeInUp}><StatCard title="Total Income" value={data?.total_income || 0} icon={<TrendingUp size={28} />} isCurrency trend="Life-to-date" /></motion.div>
          <motion.div variants={fadeInUp}><StatCard title="Total Expenses" value={data?.total_expenses || 0} icon={<TrendingDown size={28} />} isCurrency /></motion.div>
          <motion.div variants={fadeInUp}><StatCard title="Registered Members" value={data?.total_members || 0} icon={<Users size={28} />} /></motion.div>
          <motion.div variants={fadeInUp}><StatCard title="Membership Entry Fees" value={data?.membership_fees || 0} icon={<Wallet size={28} />} isCurrency /></motion.div>
          <motion.div variants={fadeInUp}><StatCard title="Recurring Monthly Fees" value={data?.monthly_fees || 0} icon={<Wallet size={28} />} isCurrency /></motion.div>
        </motion.div>

        {/* 3. VILLAGE NOTICE BOARD (The "Status Matrix") */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.5, duration: 0.8 }} 
          className="mt-12"
        >
          <ContributionMatrix />
        </motion.div>

        {/* 4. DETAILED AUDIT LOGS (The Ledger Table) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.7, duration: 0.8 }} 
          className="mt-12 bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 min-h-[500px]"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight italic">Transaction Audit Logs</h3>
              <p className="text-slate-500 text-sm">Detailed history of every rupee received or spent.</p>
            </div>
            <div className="px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Live Feed
            </div>
          </div>
          
          <FoundationLedgerTable />
        </motion.div>

        {/* --- ADMINISTRATIVE MODALS --- */}
        <LogFeeModal isOpen={isFeeModalOpen} onClose={() => setIsFeeModalOpen(false)} />
        <AddMemberModal isOpen={isMemberModalOpen} onClose={() => setIsMemberModalOpen(false)} />

      </div>
    </div>
  );
}