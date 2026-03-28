import { useState } from 'react';
import { useVillageLedger } from '../../hooks/useVillageLedger';
import { ArrowDownRight, ArrowUpRight, Receipt, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function VillageLedgerTable() {
  const [activeTab, setActiveTab] = useState('ALL');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useVillageLedger('2025-26', activeTab, page);

  const tabs = [
    { id: 'ALL', label: 'All Transactions' },
    { id: 'CREDIT', label: 'Income' },
    { id: 'DEBIT', label: 'Expenses' }
  ];

  return (
    <div className="w-full">
      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-6 mb-6 gap-4">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Recent Transactions</h2>
        <div className="flex gap-2 p-1 bg-slate-100/80 rounded-xl overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setPage(1); }}
              className={`px-5 py-2 text-sm font-semibold rounded-lg cursor-pointer transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-white text-trustBlue-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 text-trustBlue-400">
          <Loader2 size={32} className="animate-spin mb-4" />
          <p className="font-medium text-slate-500">Loading village ledger...</p>
        </div>
      ) : data?.data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
          <Receipt size={48} className="text-slate-200 mb-4" />
          <p className="font-medium text-slate-500">No transactions found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-sm uppercase tracking-wider text-slate-500">
                <th className="pb-4 font-semibold">Date & Voucher</th>
                <th className="pb-4 font-semibold">Party & Description</th>
                <th className="pb-4 font-semibold">Category</th>
                <th className="pb-4 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data?.data?.map((txn: any) => (
                <tr key={txn._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 pr-4">
                    <p className="font-bold text-slate-900">{new Date(txn.txn_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    <p className="text-xs text-slate-500 mt-1 font-mono">{txn.voucher_number}</p>
                  </td>
                  <td className="py-4 pr-4">
                    <p className="font-semibold text-slate-800">{txn.party_name}</p>
                    <p className="text-sm text-slate-500 mt-1 truncate max-w-xs">{txn.description}</p>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                      {txn.category.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {txn.type === 'CREDIT' ? (
                        <ArrowUpRight size={16} className="text-emerald-500" />
                      ) : (
                        <ArrowDownRight size={16} className="text-red-500" />
                      )}
                      <span className={`font-bold ${txn.type === 'CREDIT' ? 'text-emerald-600' : 'text-slate-900'}`}>
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(txn.amount)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
            <span className="text-sm text-slate-500">
              Showing page {data.page} of {data.total_pages}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={() => setPage(p => Math.min(data.total_pages, p + 1))}
                disabled={page === data.total_pages}
                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}