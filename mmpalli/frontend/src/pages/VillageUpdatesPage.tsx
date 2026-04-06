import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { publicApi, adminApi } from '../config/api';
import { useAuth } from '../context/AuthContext';
import VillageSlideshow from '../components/village/VillageSlideshow';
import { Camera, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VillageUpdatesPage() {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [newUpdate, setNewUpdate] = useState({ title: '', description: '', image_url: '', category: 'BIRTHDAY' });

  const { data: updates, isLoading } = useQuery({
    queryKey: ['villageUpdates'],
    queryFn: () => publicApi.get('/foundation/village-updates').then((r) => r.data),
  });

  const addMutation = useMutation({
    mutationFn: (data: typeof newUpdate) => adminApi.post('/foundation/village-updates', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['villageUpdates'] });
      setNewUpdate({ title: '', description: '', image_url: '', category: 'BIRTHDAY' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.delete(`/foundation/village-updates/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['villageUpdates'] }),
  });

  return (
    <div className="page-shell pt-6 sm:pt-8">
      <div className="site-container space-y-8">
        <section className="hero-panel text-white">
          <div className="relative z-10 max-w-3xl">
            <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-white/75 transition hover:text-white">
              <ArrowLeft size={16} /> Back to home
            </Link>
            <span className="eyebrow">Community spotlight</span>
            <h1 className="display-title mt-5 text-5xl leading-tight sm:text-6xl">Village news and celebrations in a calmer showcase.</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-white/76 sm:text-lg">
              Birthdays, festivals, weddings, and updates now appear in a cleaner visual format with less noise and better readability.
            </p>
          </div>
        </section>

        <section className="section-card p-4 sm:p-6">
          {isLoading ? (
            <div className="flex min-h-[360px] items-center justify-center text-slate-500">Loading spotlight updates...</div>
          ) : (
            <VillageSlideshow updates={updates || []} />
          )}
        </section>

        {isAdmin && (
          <section className="section-card p-6 sm:p-8">
            <div className="mb-6">
              <p className="muted-label">Admin tools</p>
              <h2 className="section-title mt-2">Create or remove spotlight cards</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="field-label">Title</label>
                <input
                  value={newUpdate.title}
                  onChange={(e) => setNewUpdate({ ...newUpdate, title: e.target.value })}
                  placeholder="Happy wedding, festival update, village news"
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
                  <option value="NEWS">General news</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="field-label">Description</label>
                <textarea
                  value={newUpdate.description}
                  onChange={(e) => setNewUpdate({ ...newUpdate, description: e.target.value })}
                  rows={4}
                  placeholder="Write the update clearly so it is easy for everyone to read."
                  className="field-input resize-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="field-label">Image URL</label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="btn-ghost justify-center sm:w-44">
                    <Camera size={16} /> Image link
                  </div>
                  <input
                    value={newUpdate.image_url}
                    onChange={(e) => setNewUpdate({ ...newUpdate, image_url: e.target.value })}
                    placeholder="Paste image URL"
                    className="field-input"
                  />
                </div>
              </div>
            </div>

            <button onClick={() => addMutation.mutate(newUpdate)} className="btn-primary mt-6 w-full justify-center py-4 text-base">
              {addMutation.isPending ? 'Publishing...' : 'Publish spotlight'}
            </button>

            {!!updates?.length && (
              <div className="mt-8 border-t border-[color:var(--line)] pt-6">
                <p className="field-label">Existing cards</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {updates.map((up: any) => (
                    <button
                      key={up._id}
                      onClick={() => deleteMutation.mutate(up._id)}
                      className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-rose-700"
                    >
                      <Trash2 size={14} /> Remove {up.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

