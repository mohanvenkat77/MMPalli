import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  isCurrency?: boolean;
}

export default function StatCard({ title, value, icon, trend, isCurrency }: StatCardProps) {
  // Format numbers as Indian Rupees natively!
  const formattedValue = isCurrency && typeof value === 'number'
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)
    : value;

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
      {/* Animated Left Border */}
      <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-saffron-500 to-trustBlue-900 opacity-80"></div>
      
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-trustBlue-900">{formattedValue}</h3>
          
          {trend && (
            <p className="text-xs font-medium mt-2 bg-emerald-50 text-emerald-700 inline-flex items-center px-2 py-1 rounded-full">
              {trend}
            </p>
          )}
        </div>
        
        {/* Icon Container with hover effect */}
        <div className="p-3 bg-trustBlue-50 text-trustBlue-900 rounded-xl group-hover:scale-110 group-hover:bg-saffron-50 group-hover:text-saffron-600 transition-all duration-300">
          {icon}
        </div>
      </div>
    </div>
  );
}