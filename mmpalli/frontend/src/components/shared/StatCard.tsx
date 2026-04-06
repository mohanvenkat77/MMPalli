import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  isCurrency?: boolean;
}

export default function StatCard({ title, value, icon, trend, isCurrency }: StatCardProps) {
  const formattedValue =
    isCurrency && typeof value === 'number'
      ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)
      : value;

  return (
    <div className="section-card h-full p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="muted-label">{title}</p>
          <h3 className="mt-3 break-words text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{formattedValue}</h3>
          {trend ? <span className="badge-chip mt-4">{trend}</span> : null}
        </div>
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.2rem] bg-[linear-gradient(135deg,#f6e4d3,#fff8f0)] text-[color:var(--brand-deep)] shadow-sm">
          {icon}
        </div>
      </div>
    </div>
  );
}

