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
    }
  });

  // Filter names based on search term
  const filteredData = matrix?.filter((row: any) => 
    row.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const monthKeys = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-visible">
      
      {/* 1. Header with Search and Year - Locked Style */}
      <div className="p-8 bg-trustBlue-900 text-white rounded-t-[2.5rem]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-saffron-500 rounded-2xl shadow-lg shadow-saffron-500/20">
              <Users className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black italic tracking-tight">Monthly Contribution Board</h2>
              <p className="text-trustBlue-200 text-sm">Village-wide Payment Status</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* SEARCH BAR */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-4 top-3 text-trustBlue-400" size={18} />
              <input 
                type="text"
                placeholder="Find by name..."
                className="w-full pl-12 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-trustBlue-300 outline-none focus:ring-2 focus:ring-saffron-500 transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* YEAR SELECT */}
            <div className="relative w-full sm:w-32">
              <Calendar className="absolute left-3 top-3 text-trustBlue-400" size={16} />
              <select 
                value={year} 
                onChange={(e) => setYear(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl font-bold text-sm outline-none cursor-pointer appearance-none"
              >
                <option value="2026" className="text-black">2026 Year</option>
                <option value="2025" className="text-black">2025 Year</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. The Table - Expanded (No height scroll) */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="sticky left-0 z-10 bg-slate-50 px-8 py-5 font-black text-[10px] text-slate-400 uppercase tracking-widest border-r border-slate-100">
                Member Name
              </th>
              {monthKeys.map(m => (
                <th key={m} className="px-4 py-5 font-black text-[10px] text-slate-400 uppercase text-center min-w-[85px]">
                  {m}
                </th>
              ))}
              <th className="px-8 py-5 font-black text-[10px] text-saffron-600 uppercase text-right bg-saffron-50/30">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              <tr><td colSpan={14} className="py-20 text-center text-slate-400 italic animate-pulse">Checking records...</td></tr>
            ) : filteredData?.length > 0 ? (
              filteredData.map((row: any) => (
                <tr key={row.phone} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50 px-8 py-6 border-r border-slate-100 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.03)]">
                    <span className="font-bold text-slate-800 text-sm whitespace-nowrap">{row.name}</span>
                  </td>

                  {monthKeys.map(m => (
                    <td key={m} className="px-2 py-6 text-center">
                      {row.months[m] > 0 ? (
                        <div className="flex flex-col items-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mb-1 shadow-sm" />
                          <span className="text-[10px] font-black text-emerald-700">₹{row.months[m]}</span>
                        </div>
                      ) : (
                        // --- UPDATED PENDING STYLE TO RED ---
                        <div className="flex flex-col items-center opacity-60 group-hover:opacity-100 transition-opacity">
                          <div className="w-2 h-2 rounded-full bg-rose-500 mb-1" />
                          <span className="text-[10px] font-black text-rose-500">0</span>
                        </div>
                      )}
                    </td>
                  ))}

                  <td className="px-8 py-6 text-right bg-saffron-50/10">
                    <span className="font-black text-slate-900 text-sm">₹{row.total}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={14} className="py-20 text-center text-slate-400 font-medium bg-white">
                  No member matches "{searchTerm}" for {year}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* 3. Legend Footer - Updated Pending Color */}
      <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-wrap justify-center gap-10">
          <div className="flex items-center gap-3 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30" /> Paid
          </div>
          <div className="flex items-center gap-3 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
            {/* UPDATED FOOTER COLOR TO RED */}
            <div className="w-3 h-3 rounded-full bg-rose-500 shadow-lg shadow-rose-500/30" /> Pending (₹0)
          </div>
      </div>
    </div>
  );
}