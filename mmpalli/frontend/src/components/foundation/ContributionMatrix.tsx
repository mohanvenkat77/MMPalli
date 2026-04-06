import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../../config/api';
import { Search, Users, Calendar } from 'lucide-react';

export default function ContributionMatrix() {
  const [year, setYear] = useState('2026');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: matrix, isLoading } = useQuery({
    queryKey: ['contributionMatrix', year],
    queryFn: async () => {
      const res = await publicApi.get(`/foundation/contribution-matrix?year=${year}`);
      return res.data;
    },
  });

  const filteredData = matrix?.filter((row: any) => row.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const monthKeys = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="section-card overflow-hidden">
      <div className="border-b border-[color:var(--line)] px-6 py-6 sm:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="muted-label">Contribution board</p>
            <h2 className="section-title mt-2">Monthly member status</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              Search by member name and review payment completion month by month in a cleaner, easier-to-scan table.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search member"
                className="field-input min-w-[220px] pl-11"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </label>
            <label className="relative block">
              <Calendar className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select value={year} onChange={(e) => setYear(e.target.value)} className="field-input min-w-[150px] pl-11">
                <option value="2026">2026</option>
                <option value="2025">2025</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-stone-100/80 text-[11px] uppercase tracking-[0.2em] text-slate-500">
            <tr>
              <th className="sticky left-0 z-10 bg-stone-100/95 px-6 py-4">Member</th>
              {monthKeys.map((m) => (
                <th key={m} className="px-3 py-4 text-center min-w-[84px]">{m}</th>
              ))}
              <th className="px-6 py-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200/70 bg-white/50">
            {isLoading ? (
              <tr>
                <td colSpan={14} className="px-6 py-16 text-center text-slate-500">Loading contribution records...</td>
              </tr>
            ) : filteredData?.length ? (
              filteredData.map((row: any) => (
                <tr key={row.phone} className="hover:bg-stone-50/80">
                  <td className="sticky left-0 z-10 bg-[color:var(--panel-strong)] px-6 py-5 font-semibold text-slate-800 shadow-[4px_0_12px_-10px_rgba(0,0,0,0.2)]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f7e8d9,#ffffff)] text-[color:var(--brand-deep)]">
                        <Users size={16} />
                      </div>
                      <span className="whitespace-nowrap">{row.name}</span>
                    </div>
                  </td>
                  {monthKeys.map((m) => {
                    const amount = row.months[m];
                    const paid = amount > 0;
                    return (
                      <td key={m} className="px-3 py-5 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <div className={`h-2.5 w-2.5 rounded-full ${paid ? 'bg-emerald-500' : 'bg-rose-400'}`} />
                          <span className={`text-[11px] font-bold ${paid ? 'text-emerald-700' : 'text-rose-500'}`}>
                            {paid ? `Rs ${amount}` : '0'}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                  <td className="px-6 py-5 text-right font-extrabold text-slate-900">Rs {row.total}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={14} className="px-6 py-16 text-center text-slate-500">
                  No member matches "{searchTerm}" for {year}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 border-t border-[color:var(--line)] bg-stone-100/70 px-6 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-emerald-500" /> Paid</span>
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-rose-400" /> Pending</span>
      </div>
    </div>
  );
}

