import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useVillageSummary } from '../hooks/useVillageSummary';
import StatCard from '../components/shared/StatCard';
import { TrendingUp, TrendingDown, Landmark, ArrowLeft, Download, FileText, Anchor, Building2, Plus } from 'lucide-react';
import VillageLedgerTable from '../components/village/VillageLedgerTable';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LogVillageTxnModal from '../components/admin/LogVillageTxnModal';

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function VillageAccountsPage() {
  // --- ADMIN STATE ---
  const { isAdmin } = useAuth(); 
  const [isTxnModalOpen, setIsTxnModalOpen] = useState(false);
  
  // Financial Year synced to 2025-26
  const { data, isLoading, isError } = useVillageSummary('2025-26');

  if (isLoading) return (
    <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-trustBlue-200 border-t-trustBlue-600 rounded-full animate-spin"></div>
    </div>
  );

  if (isError) return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 max-w-md shadow-sm">
        <h2 className="text-xl font-bold mb-2">Connection Error</h2>
        <p className="opacity-80">Failed to load village data. Please ensure your backend server is running on port 5000.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAF9] selection:bg-trustBlue-500 selection:text-white pb-24 font-sans overflow-hidden">
      
      {/* 1. HERO HEADER */}
      <div className="relative pt-8 pb-32 lg:pb-40 overflow-hidden bg-slate-900 shadow-inner">
        {/* Animated Background Orbs */}
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.3, 0.15] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-[50%] right-[0%] w-[50vw] h-[50vw] rounded-full bg-trustBlue-500/40 blur-[100px]" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.25, 0.1] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-[20%] -left-[10%] w-[40vw] h-[40vw] rounded-full bg-emerald-500/30 blur-[100px]" />
        
        {/* Hardcoded Noise SVG to prevent 403 errors */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI24pIi8+PC9zdmc+')] opacity-[0.03] mix-blend-overlay"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Link to="/" className="inline-flex items-center text-slate-300 hover:text-white transition-colors mb-10 font-medium group">
            <ArrowLeft size={20} className="mr-2 transition-transform group-hover:-translate-x-1" /> Back to Home
          </Link>
          
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <motion.div variants={fadeInUp} className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-emerald-300 text-sm font-semibold tracking-wider mb-4 shadow-sm">
                FINANCIAL YEAR 2025-26
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
                Village <span className="text-transparent bg-clip-text bg-gradient-to-r from-trustBlue-400 to-emerald-300">Accounts</span>
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-slate-300 text-lg mt-4 max-w-xl leading-relaxed border-l-2 border-emerald-500 pl-4 opacity-90">
                Track grand pond auction revenues, government funds, and major community infrastructure expenditures.
              </motion.p>
            </div>

            {/* ACTION BUTTONS */}
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              {isAdmin && (
                <button 
                  onClick={() => setIsTxnModalOpen(true)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 px-6 py-3 rounded-xl font-bold flex items-center transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Plus size={20} className="mr-2" /> Add Transaction
                </button>
              )}

              <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md px-6 py-3 rounded-xl font-semibold flex items-center transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                <Download size={18} className="mr-2" /> Export CSV
              </button>
              <button className="bg-gradient-to-r from-trustBlue-600 to-trustBlue-700 hover:from-trustBlue-500 hover:to-trustBlue-600 text-white shadow-lg shadow-trustBlue-900/40 px-6 py-3 rounded-xl font-semibold flex items-center transition-all duration-300 hover:-translate-y-0.5">
                <FileText size={18} className="mr-2" /> Generate Report
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* 2. MAIN DASHBOARD CONTENT */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 lg:-mt-20">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          
          <motion.div variants={fadeInUp} className="lg:col-span-2">
            <StatCard title="Village Balance" value={data?.balance || 0} icon={<Landmark size={28} />} isCurrency />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <StatCard title="Total Income" value={data?.total_income || 0} icon={<TrendingUp size={28} />} isCurrency trend="All sources" />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <StatCard title="Total Expenses" value={data?.total_expenses || 0} icon={<TrendingDown size={28} />} isCurrency />
          </motion.div>
          
          <motion.div variants={fadeInUp} className="lg:col-span-2">
            <StatCard title="Pond Auction Revenue" value={data?.pond_auction_income || 0} icon={<Anchor size={28} />} isCurrency trend="Community Asset" />
          </motion.div>
          <motion.div variants={fadeInUp} className="lg:col-span-2">
            <StatCard title="Government Funds" value={data?.government_funds || 0} icon={<Building2 size={28} />} isCurrency />
          </motion.div>
        </motion.div>

        {/* 3. LEDGER TABLE */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.6, duration: 0.7 }} 
          className="mt-12 bg-white/80 backdrop-blur-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-8 min-h-[400px]"
        >
          <VillageLedgerTable />
        </motion.div>
        
        {/* DATA ENTRY MODAL */}
        <LogVillageTxnModal isOpen={isTxnModalOpen} onClose={() => setIsTxnModalOpen(false)} />

      </div>
    </div>
  );
}