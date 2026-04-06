import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { publicApi, adminApi } from '../config/api';
import { useAuth } from '../context/AuthContext';
import {
  ArrowRight,
  Landmark,
  Tent,
  Settings,
  X,
  Camera,
  Trash2,
  ChevronLeft,
  ChevronRight,
  HeartHandshake,
} from 'lucide-react';
import YouthContactsDirectory from '../components/shared/YouthContactsDirectory';

const categoryStyles: Record<string, string> = {
  BIRTHDAY: 'bg-amber-100 text-amber-800',
  MARRIAGE: 'bg-rose-100 text-rose-700',
  FESTIVAL: 'bg-emerald-100 text-emerald-700',
  GENERAL: 'bg-slate-200 text-slate-700',
  NEWS: 'bg-slate-200 text-slate-700',
};

const quickLinks = [
  {
    title: 'Foundation Accounts',
    description: 'Monthly fees, member support, and trust expenses in one clear ledger.',
    to: '/foundation',
    icon: Landmark,
    accent: 'from-amber-200 via-orange-100 to-white',
  },
  {
    title: 'Village Accounts',
    description: 'Auction funds, public works, and development spending presented simply.',
    to: '/village-accounts',
    icon: Tent,
    accent: 'from-emerald-200 via-teal-100 to-white',
  },
  {
    title: 'Ambedhkar Jayanthi',
    description: 'Community celebration contributions and expense tracking with better clarity.',
    to: '/ambedhkar-jayanthi',
    icon: HeartHandshake,
    accent: 'from-sky-200 via-cyan-100 to-white',
  },
];

export default function LandingPage() {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [newUpdate, setNewUpdate] = useState({ title: '', description: '', image_url: '', category: 'GENERAL' });

  const { data: updates, isLoading } = useQuery({
    queryKey: ['villageUpdates'],
    queryFn: () => publicApi.get('/foundation/village-updates').then((r) => r.data),
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const width = 800;
        const height = (img.height / img.width) * width;

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.4);
        setNewUpdate((current) => ({ ...current, image_url: compressedBase64 }));
      };
    };
  };

  const addMutation = useMutation({
    mutationFn: (data: typeof newUpdate) => adminApi.post('/foundation/village-updates', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['villageUpdates'] });
      setIsEditModalOpen(false);
      setNewUpdate({ title: '', description: '', image_url: '', category: 'GENERAL' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.delete(`/foundation/village-updates/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['villageUpdates'] });
      setSlideIndex(0);
    },
  });

  const activeUpdate = useMemo(() => {
    if (!updates?.length) return null;
    return updates[slideIndex % updates.length];
  }, [updates, slideIndex]);

  const nextSlide = () => updates?.length && setSlideIndex((prev) => (prev + 1) % updates.length);
  const prevSlide = () => updates?.length && setSlideIndex((prev) => (prev - 1 + updates.length) % updates.length);

  return (
    <div className="page-shell pt-6 sm:pt-8">
      <div className="site-container space-y-8 sm:space-y-10">
        <section className="hero-panel">
          <div className="relative z-10 grid gap-10 lg:grid-cols-[1.25fr_0.9fr] lg:items-end">
            <div className="space-y-6 text-white">
              <span className="eyebrow">MatlaMala Palli community portal</span>
              <div className="space-y-4">
                <h1 className="display-title max-w-3xl text-5xl leading-tight sm:text-6xl lg:text-7xl">
                  <span className="bg-gradient-to-r from-amber-200 via-orange-200 to-yellow-100 bg-clip-text text-transparent">
                    Matla Mala Palli
                  </span>
                </h1>
                <p className="max-w-2xl text-base leading-8 text-white/76 sm:text-lg">
                  Track community funds, celebrations, and development progress through a simpler experience that feels trustworthy,
                  calm, and easy for everyone to understand.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link to="/foundation" className="btn-primary">
                  View Foundation Ledger
                  <ArrowRight size={16} />
                </Link>
                <Link to="/village-accounts" className="btn-secondary">
                  Explore Village Accounts
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/12 bg-white/10 p-5 backdrop-blur-md">
                <p className="muted-label text-white/60">What improves now</p>
                <p className="mt-3 text-2xl font-semibold text-white">Less distraction, better reading flow, premium styling.</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/12 bg-white/10 p-5 backdrop-blur-md">
                <p className="muted-label text-white/60">Village focus</p>
                <div className="mt-4 space-y-3 text-sm leading-7 text-white/82">
                  <p>Important records stay visible and easy to scan.</p>
                  <p>Spotlight updates look attractive without too much movement.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          {quickLinks.map(({ title, description, to, icon: Icon, accent }) => (
            <Link key={title} to={to} className="section-card group block overflow-hidden p-7">
              <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-[1.2rem] bg-gradient-to-br ${accent}`}>
                <Icon className="text-slate-800" size={24} />
              </div>
              <h2 className="display-title text-3xl text-slate-900">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--brand-deep)]">
                Open section
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-stretch">
          <div className="section-card overflow-hidden">
            <div className="flex flex-col gap-4 border-b border-[color:var(--line)] px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <div>
                <p className="muted-label">Village spotlight</p>
                <h2 className="section-title mt-2">Updates that are easier to read and share</h2>
              </div>
              {isAdmin && (
                <button onClick={() => setIsEditModalOpen(true)} className="btn-ghost self-start sm:self-auto">
                  <Settings size={16} />
                  Manage spotlight
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="flex min-h-[420px] items-center justify-center px-6 py-12 text-slate-500">Loading spotlight updates...</div>
            ) : activeUpdate ? (
              <div className="grid min-h-[420px] lg:grid-cols-[1fr_0.92fr]">
                <div className="min-h-[280px] bg-stone-200">
                  <img src={activeUpdate.image_url} alt={activeUpdate.title} className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-col justify-between bg-[color:var(--panel-strong)] p-6 sm:p-8">
                  <div>
                    <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${categoryStyles[activeUpdate.category] || categoryStyles.GENERAL}`}>
                      {activeUpdate.category}
                    </span>
                    <h3 className="display-title mt-5 text-4xl leading-tight text-slate-900">{activeUpdate.title}</h3>
                    <p className="mt-4 max-w-xl text-base leading-8 text-slate-600">{activeUpdate.description}</p>
                  </div>

                  <div className="mt-8 flex items-center justify-between gap-4">
                    <div className="text-sm text-slate-500">Card {slideIndex + 1} of {updates.length}</div>
                    <div className="flex gap-3">
                      <button onClick={prevSlide} className="btn-ghost h-12 w-12 rounded-full px-0" aria-label="Previous update">
                        <ChevronLeft size={18} />
                      </button>
                      <button onClick={nextSlide} className="btn-primary h-12 w-12 rounded-full px-0" aria-label="Next update">
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[320px] items-center justify-center px-6 py-12 text-center text-slate-500">
                No updates have been published yet.
              </div>
            )}
          </div>

          <YouthContactsDirectory />
        </section>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} aria-label="Close modal" />
          <div className="section-card relative z-10 w-full max-w-2xl p-6 sm:p-8">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <p className="muted-label">Admin tools</p>
                <h3 className="display-title mt-2 text-3xl text-slate-900">Create spotlight update</h3>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="btn-ghost h-11 w-11 rounded-full px-0">
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="field-label">Title</label>
                <input
                  value={newUpdate.title}
                  onChange={(e) => setNewUpdate({ ...newUpdate, title: e.target.value })}
                  type="text"
                  placeholder="Community news title"
                  className="field-input"
                />
              </div>
              <div>
                <label className="field-label">Category</label>
                <select
                  value={newUpdate.category}
                  onChange={(e) => setNewUpdate({ ...newUpdate, category: e.target.value })}
                  className="field-input"
                >
                  <option value="BIRTHDAY">Birthday</option>
                  <option value="MARRIAGE">Marriage</option>
                  <option value="FESTIVAL">Festival</option>
                  <option value="GENERAL">General news</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="field-label">Description</label>
                <textarea
                  value={newUpdate.description}
                  onChange={(e) => setNewUpdate({ ...newUpdate, description: e.target.value })}
                  rows={4}
                  placeholder="Write a clear summary for everyone in the village."
                  className="field-input resize-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="field-label">Photo</label>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                <div className="flex flex-col gap-4 sm:flex-row">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-ghost justify-center sm:w-44">
                    <Camera size={16} />
                    Upload image
                  </button>
                  <input
                    value={newUpdate.image_url}
                    onChange={(e) => setNewUpdate({ ...newUpdate, image_url: e.target.value })}
                    type="text"
                    placeholder="Or paste an image URL"
                    className="field-input"
                  />
                </div>
              </div>
            </div>

            {newUpdate.image_url && (
              <div className="mt-5 h-28 w-28 overflow-hidden rounded-[1.2rem] border border-[color:var(--line)]">
                <img src={newUpdate.image_url} alt="Preview" className="h-full w-full object-cover" />
              </div>
            )}

            <button
              onClick={() => addMutation.mutate(newUpdate)}
              className="btn-primary mt-8 w-full justify-center py-4 text-base"
              disabled={addMutation.isPending || !newUpdate.title}
            >
              {addMutation.isPending ? 'Publishing...' : 'Publish spotlight'}
            </button>

            {!!updates?.length && (
              <div className="mt-8 border-t border-[color:var(--line)] pt-6">
                <p className="field-label">Delete existing spotlight cards</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {updates.map((up: any) => (
                    <button
                      key={up._id}
                      onClick={() => deleteMutation.mutate(up._id)}
                      disabled={deleteMutation.isPending}
                      className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-rose-700 disabled:opacity-50"
                    >
                      <Trash2 size={14} /> Remove {up.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
