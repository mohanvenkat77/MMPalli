import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  isCurrency?: boolean;
}

export default function StatCard({ title, value, icon, trend, isCurrency }: StatCardProps) {
  const formattedValue = isCurrency && typeof value === 'number'
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)
    : value;

  return (
    <div className="h-full bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all border-l-[6px] border-l-emerald-500">
      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0"> {/* min-w-0 prevents text from pushing the icon out */}
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] truncate mb-1">
            {title}
          </p>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight break-words">
            {formattedValue}
          </h3>
        </div>
        
        {/* Fixed size icon container prevents overlapping */}
        <div className="shrink-0 p-3 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex">
          <span className="text-[9px] font-black px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg uppercase tracking-tight">
            {trend}
          </span>
        </div>
      )}
    </div>
  );
}