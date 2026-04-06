import { Link } from 'react-router-dom';
import { useState } from 'react';
import { TrendingUp, TrendingDown, Landmark, ArrowLeft, Anchor, Building2, Plus } from 'lucide-react';
import { useVillageSummary } from '../hooks/useVillageSummary';
import StatCard from '../components/shared/StatCard';
import VillageLedgerTable from '../components/village/VillageLedgerTable';
import { useAuth } from '../context/AuthContext';
import LogVillageTxnModal from '../components/admin/LogVillageTxnModal';
import { getCurrentFinancialYear } from '../utils/financialYear';

export default function VillageAccountsPage() {
  const { isAdmin } = useAuth();
  const [isTxnModalOpen, setIsTxnModalOpen] = useState(false);
  const currentFinancialYear = getCurrentFinancialYear();
  const { data, isLoading, isError } = useVillageSummary(currentFinancialYear);

  if (isLoading) {
    return (
      <div className="page-shell flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-stone-300 border-t-[color:var(--olive)]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="page-shell flex items-center justify-center px-4">
        <div className="section-card max-w-md p-8 text-center">
          <h2 className="display-title text-3xl text-slate-900">Unable to load village accounts</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">Please make sure the backend server is running on port 5000, then refresh the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell pt-6 sm:pt-8">
      <div className="site-container space-y-8">
        <section className="hero-panel px-5 py-5 sm:px-8 sm:py-8 lg:px-12 lg:py-12 text-white">
          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/75 transition hover:text-white">
                  <ArrowLeft size={16} /> Back to home
                </Link>
                <span className="eyebrow">Financial year {currentFinancialYear}</span>
              </div>
              <h1 className="display-title mt-3 text-3xl leading-tight sm:text-5xl lg:text-6xl">Village accounts presented in a cleaner public dashboard.</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/76 sm:text-lg sm:leading-8">
                Track auction income, government support, and development spending in a format that is easier for everyone to review.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              {isAdmin && (
                <button onClick={() => setIsTxnModalOpen(true)} className="btn-primary">
                  <Plus size={16} /> Add transaction
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="xl:col-span-2"><StatCard title="Village Balance" value={data?.balance || 0} icon={<Landmark size={24} />} isCurrency /></div>
          <StatCard title="Total Income" value={data?.total_income || 0} icon={<TrendingUp size={24} />} isCurrency trend="All sources" />
          <StatCard title="Total Expenses" value={data?.total_expenses || 0} icon={<TrendingDown size={24} />} isCurrency />
          <div className="xl:col-span-2"><StatCard title="Pond Auction Revenue" value={data?.pond_auction_income || 0} icon={<Anchor size={24} />} isCurrency trend="Community asset" /></div>
          <div className="xl:col-span-2"><StatCard title="Government Funds" value={data?.government_funds || 0} icon={<Building2 size={24} />} isCurrency /></div>
        </section>

        <section className="section-card p-6 sm:p-8">
          <div className="mb-6 flex flex-col gap-2 border-b border-[color:var(--line)] pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="muted-label">Detailed ledger</p>
              <h2 className="section-title mt-2">Village transaction history</h2>
            </div>
            <p className="text-sm text-slate-500">A more readable audit table for credits, expenses, and categorized entries.</p>
          </div>
          <VillageLedgerTable />
        </section>

        <LogVillageTxnModal isOpen={isTxnModalOpen} onClose={() => setIsTxnModalOpen(false)} />
      </div>
    </div>
  );
}
