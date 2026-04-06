import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const categoryStyles: Record<string, string> = {
  BIRTHDAY: 'bg-amber-100 text-amber-800',
  MARRIAGE: 'bg-rose-100 text-rose-700',
  FESTIVAL: 'bg-emerald-100 text-emerald-700',
  GENERAL: 'bg-slate-200 text-slate-700',
  NEWS: 'bg-slate-200 text-slate-700',
};

export default function VillageSlideshow({ updates }: { updates: any[] }) {
  const [index, setIndex] = useState(0);

  if (!updates || updates.length === 0) {
    return <div className="flex min-h-[360px] items-center justify-center text-slate-500">No spotlight cards available yet.</div>;
  }

  const current = updates[index % updates.length];

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-[color:var(--line)] bg-[color:var(--panel-strong)]">
      <div className="grid min-h-[440px] lg:grid-cols-[1fr_0.92fr]">
        <div className="min-h-[280px] bg-stone-200">
          <img
            src={current.image_url || 'https://images.unsplash.com/photo-1518173946687-a4c8a9ba332f'}
            className="h-full w-full object-cover"
            alt={current.title}
          />
        </div>

        <div className="flex flex-col justify-between p-6 sm:p-8">
          <div>
            <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${categoryStyles[current.category] || categoryStyles.GENERAL}`}>
              {current.category}
            </span>
            <h2 className="display-title mt-5 text-4xl leading-tight text-slate-900">{current.title}</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">{current.description}</p>
          </div>

          <div className="mt-8 flex items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              Card {index + 1} of {updates.length}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setIndex((prev) => (prev - 1 + updates.length) % updates.length)} className="btn-ghost h-11 w-11 rounded-full px-0">
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => setIndex((prev) => (prev + 1) % updates.length)} className="btn-primary h-11 w-11 rounded-full px-0">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

