import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Landmark, Plus, TrendingDown, TrendingUp, Users, MicVocal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAmbedhkarSummary } from '../hooks/useAmbedhkarSummary';
import StatCard from '../components/shared/StatCard';
import AmbedhkarLedgerTable from '../components/ambedhkar/AmbedhkarLedgerTable';
import LogAmbedhkarTxnModal from '../components/admin/LogAmbedhkarTxnModal';

export default function AmbedhkarJayanthiPage() {
  const { isAdmin } = useAuth();
  const [isTxnModalOpen, setIsTxnModalOpen] = useState(false);
  const { data, isLoading, isError } = useAmbedhkarSummary('2025-26');

  if (isLoading) {
    return (
      <div className="page-shell flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-stone-300 border-t-[color:var(--sky)]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="page-shell flex items-center justify-center px-4">
        <div className="section-card max-w-md p-8 text-center">
          <h2 className="display-title text-3xl text-slate-900">Unable to load celebration data</h2>
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
                <span className="eyebrow">Financial year 2025-26</span>
              </div>
              <h1 className="display-title mt-3 text-3xl leading-tight sm:text-5xl lg:text-6xl">Ambedhkar Jayanthi records with better focus and clarity.</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/76 sm:text-lg sm:leading-8">
                Follow contributions, celebration expenses, and overall balance in a layout that feels premium and easy to understand.
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
          <div className="xl:col-span-2"><StatCard title="Available Balance" value={data?.balance || 0} icon={<Landmark size={24} />} isCurrency /></div>
          <StatCard title="Total Contributions" value={data?.total_income || 0} icon={<TrendingUp size={24} />} isCurrency trend="Community support" />
          <StatCard title="Total Expenses" value={data?.total_expenses || 0} icon={<TrendingDown size={24} />} isCurrency />
          <div className="xl:col-span-2"><StatCard title="Contribution Pool" value={data?.total_contributions || 0} icon={<MicVocal size={24} />} isCurrency trend="Celebration fund" /></div>
          <div className="xl:col-span-2"><StatCard title="Contributors" value={data?.total_contributors || 0} icon={<Users size={24} />} /></div>
        </section>

        <section className="section-card p-6 sm:p-8">
          <div className="mb-6 flex flex-col gap-2 border-b border-[color:var(--line)] pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="muted-label">Detailed ledger</p>
              <h2 className="section-title mt-2">Celebration transaction history</h2>
            </div>
            <p className="text-sm text-slate-500">Contributions and event expenses are now easier to compare at a glance.</p>
          </div>
          <AmbedhkarLedgerTable />
        </section>

        <LogAmbedhkarTxnModal isOpen={isTxnModalOpen} onClose={() => setIsTxnModalOpen(false)} />
      </div>
    </div>
  );
}
