import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { publicApi, adminApi } from '../config/api';
import { useAuth } from '../context/AuthContext';
import VillageSlideshow from '../components/village/VillageSlideshow';
import { Sparkles, Camera, Trash2, ArrowLeft, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VillageUpdatesPage() {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [newUpdate, setNewUpdate] = useState({ title: '', description: '', image_url: '', category: 'BIRTHDAY' });

  const { data: updates, isLoading } = useQuery({
    queryKey: ['villageUpdates'],
    queryFn: () => publicApi.get('/foundation/village-updates').then(r => r.data)
  });

  const addMutation = useMutation({
    mutationFn: (data: any) => adminApi.post('/foundation/village-updates', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['villageUpdates'] });
      setNewUpdate({ title: '', description: '', image_url: '', category: 'BIRTHDAY' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.delete(`/foundation/village-updates/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['villageUpdates'] }),
  });

  return (
    <div className="min-h-screen bg-[#FAFAF9] pb-24">
      <div className="bg-trustBlue-900 pt-12 pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="text-trustBlue-200 hover:text-white flex items-center mb-8 transition-colors"><ArrowLeft size={20} className="mr-2"/> Home</Link>
          <h1 className="text-5xl font-black text-white italic tracking-tight">Village <span className="text-saffron-400 not-italic">Spotlight</span></h1>
          <p className="text-trustBlue-200 mt-2 text-lg">Celebrations and news from MatlaMala Palli.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-16">
        <div className="mb-20">
          <VillageSlideshow updates={updates || []} />
        </div>

        {isAdmin && (
          <div className="bg-white rounded-[2.5rem] p-10 border-2 border-dashed border-trustBlue-100 shadow-xl">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-trustBlue-900"><Camera /> Create New Spotlight Card</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <input value={newUpdate.title} onChange={e => setNewUpdate({...newUpdate, title: e.target.value})} placeholder="Title (e.g. Happy Wedding)" className="p-4 bg-slate-50 rounded-2xl outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-trustBlue-500" />
              <select value={newUpdate.category} onChange={e => setNewUpdate({...newUpdate, category: e.target.value})} className="p-4 bg-slate-50 rounded-2xl outline-none font-bold ring-1 ring-slate-200">
                <option value="BIRTHDAY">Birthday 🎂</option>
                <option value="MARRIAGE">Marriage 💍</option>
                <option value="FESTIVAL">Festival 🏮</option>
                <option value="NEWS">General News 📢</option>
              </select>
              <textarea value={newUpdate.description} onChange={e => setNewUpdate({...newUpdate, description: e.target.value})} placeholder="Write details here..." className="p-4 bg-slate-50 rounded-2xl outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-trustBlue-500 md:col-span-2" rows={3} />
              <input value={newUpdate.image_url} onChange={e => setNewUpdate({...newUpdate, image_url: e.target.value})} placeholder="Paste Image URL (Unsplash or Link)" className="p-4 bg-slate-50 rounded-2xl outline-none ring-1 ring-slate-200 md:col-span-2" />
            </div>
            <button onClick={() => addMutation.mutate(newUpdate)} className="w-full bg-trustBlue-900 text-white font-bold py-5 rounded-2xl shadow-lg hover:bg-slate-800 transition-all">Publish to Slideshow</button>
            
            <div className="mt-10 flex flex-wrap gap-3">
              {updates?.map((up: any) => (
                <button key={up._id} onClick={() => deleteMutation.mutate(up._id)} className="flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-full text-xs font-bold text-rose-600 border border-rose-100">
                  <Trash2 size={14} /> Remove "{up.title}"
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}