import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  Users,
  Wallet,
  TrendingUp,
  TrendingDown,
  Landmark,
  ArrowLeft,
  Plus,
  UserPlus,
  CheckCircle,
} from 'lucide-react';
import { useFoundationSummary } from '../hooks/useFoundationSummary';
import StatCard from '../components/shared/StatCard';
import FoundationLedgerTable from '../components/foundation/FoundationLedgerTable';
import ContributionMatrix from '../components/foundation/ContributionMatrix';
import { useAuth } from '../context/AuthContext';
import LogFeeModal from '../components/admin/LogFeeModal';
import AddMemberModal from '../components/admin/AddMemberModal';

export default function FoundationPage() {
  const { isAdmin } = useAuth();
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const { data, isLoading, isError } = useFoundationSummary('2025-26');

  if (isLoading) {
    return (
      <div className="page-shell flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-stone-300 border-t-[color:var(--brand)]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="page-shell flex items-center justify-center px-4">
        <div className="section-card max-w-md p-8 text-center">
          <h2 className="display-title text-3xl text-slate-900">Unable to load foundation data</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">Please make sure the backend server is running on port 5000, then refresh the page.</p>
          <button onClick={() => window.location.reload()} className="btn-primary mt-6">Try again</button>
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
              <h1 className="display-title mt-3 text-3xl leading-tight sm:text-5xl lg:text-6xl">Foundation records with a simpler, more readable dashboard.</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/76 sm:text-lg sm:leading-8">
                Review member collections, trust balance, and expenses in a calmer layout built for everyday use.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:max-w-md lg:justify-end">
              {isAdmin && (
                <>
                  <button onClick={() => setIsMemberModalOpen(true)} className="btn-secondary">
                    <UserPlus size={16} /> Add member
                  </button>
                  <Link to="/members" className="btn-secondary">
                    <Users size={16} /> Directory
                  </Link>
                  <Link to="/bulk-collection" className="btn-secondary">
                    <CheckCircle size={16} /> Bulk collection
                  </Link>
                  <button onClick={() => setIsFeeModalOpen(true)} className="btn-primary">
                    <Plus size={16} /> Log fee
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          <StatCard title="Current Balance" value={data?.balance || 0} icon={<Landmark size={24} />} isCurrency />
          <StatCard title="Total Income" value={data?.total_income || 0} icon={<TrendingUp size={24} />} isCurrency trend="Life to date" />
          <StatCard title="Total Expenses" value={data?.total_expenses || 0} icon={<TrendingDown size={24} />} isCurrency />
          <StatCard title="Registered Members" value={data?.total_members || 0} icon={<Users size={24} />} />
          <StatCard title="Membership Fees" value={data?.membership_fees || 0} icon={<Wallet size={24} />} isCurrency />
          <StatCard title="Monthly Fees" value={data?.monthly_fees || 0} icon={<Wallet size={24} />} isCurrency />
        </section>

        <section>
          <ContributionMatrix />
        </section>

        <section className="section-card p-6 sm:p-8">
          <div className="mb-6 flex flex-col gap-2 border-b border-[color:var(--line)] pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="muted-label">Detailed ledger</p>
              <h2 className="section-title mt-2">Transaction history</h2>
            </div>
            <p className="text-sm text-slate-500">Every rupee collected or spent is shown with context and pagination.</p>
          </div>
          <FoundationLedgerTable />
        </section>

        <LogFeeModal isOpen={isFeeModalOpen} onClose={() => setIsFeeModalOpen(false)} />
        <AddMemberModal isOpen={isMemberModalOpen} onClose={() => setIsMemberModalOpen(false)} />
      </div>
    </div>
  );
}
