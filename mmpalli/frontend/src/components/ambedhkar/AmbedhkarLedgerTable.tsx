import { useState } from 'react';
import { useAmbedhkarLedger } from '../../hooks/useAmbedhkarLedger';
import { ArrowDownRight, ArrowUpRight, Receipt, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getCurrentFinancialYear } from '../../utils/financialYear';

const currency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export default function AmbedhkarLedgerTable() {
  const [activeTab, setActiveTab] = useState('ALL');
  const [page, setPage] = useState(1);
  const currentFinancialYear = getCurrentFinancialYear();
  const { data, isLoading } = useAmbedhkarLedger(currentFinancialYear, activeTab, page);

  const tabs = [
    { id: 'ALL', label: 'All Transactions' },
    { id: 'CREDIT', label: 'Contributions' },
    { id: 'DEBIT', label: 'Expenses' },
  ];

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-4 border-b border-[color:var(--line)] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="muted-label">Celebration ledger</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">Recent transactions</h2>
        </div>
        <div className="flex gap-2 overflow-x-auto rounded-full bg-stone-100/80 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setPage(1);
              }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center text-slate-500">
          <Loader2 size={28} className="mb-3 animate-spin" />
          <p>Loading celebration ledger...</p>
        </div>
      ) : data?.data?.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center text-slate-500">
          <Receipt size={42} className="mb-3 text-slate-300" />
          <p>No transactions found.</p>
        </div>
      ) : (
        <div className="table-shell">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-stone-100/80 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Contributor</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/70 bg-white/50">
                {data?.data?.map((txn: any) => (
                  <tr key={txn._id} className="hover:bg-stone-50/70">
                    <td className="px-6 py-5">
                      <p className="font-semibold text-slate-900">
                        {new Date(txn.txn_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">{txn.voucher_number}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-semibold text-slate-800">{txn.contributor_name}</p>
                      <p className="mt-1 max-w-md text-sm text-slate-500">{txn.description}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="badge-chip">{txn.category.replace(/_/g, ' ')}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 font-bold">
                        {txn.type === 'CREDIT' ? (
                          <ArrowUpRight size={16} className="text-emerald-500" />
                        ) : (
                          <ArrowDownRight size={16} className="text-rose-500" />
                        )}
                        <span className={txn.type === 'CREDIT' ? 'text-emerald-700' : 'text-slate-900'}>{currency(txn.amount)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-[color:var(--line)] px-6 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing page {data.page} of {data.total_pages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-ghost h-10 w-10 rounded-full px-0 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))}
                disabled={page === data.total_pages}
                className="btn-ghost h-10 w-10 rounded-full px-0 disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
