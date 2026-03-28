import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { publicApi, adminApi } from '../config/api';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowRight, Landmark, Tent, Bell, Sparkles, 
  Settings, X, Camera, Plus, ChevronLeft, ChevronRight, Quote 
} from 'lucide-react';

const noiseBase64 = "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI24pIi8+PC9zdmc+')";

export default function LandingPage() {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [newUpdate, setNewUpdate] = useState({ title: '', description: '', image_url: '', category: 'GENERAL' });

  // 1. Fetch Slideshow Data
  const { data: updates, isLoading } = useQuery({
    queryKey: ['villageUpdates'],
    queryFn: () => publicApi.get('/foundation/village-updates').then(r => r.data)
  });

  // 2. Handle Image Upload (Local File to Base64)
// frontend/src/pages/LandingPage.tsx

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
      
      // FORCE SMALL DIMENSIONS
      const width = 800;
      const height = (img.height / img.width) * width;
      
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);

      // 0.4 quality is VERY small but looks okay for a slideshow
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.4);
      
      console.log("Image processed. New size:", Math.round(compressedBase64.length / 1024), "KB");
      
      setNewUpdate({ ...newUpdate, image_url: compressedBase64 });
    };
  };
};

  // 3. Add Update Mutation
  const addMutation = useMutation({
    mutationFn: (data: any) => adminApi.post('/foundation/village-updates', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['villageUpdates'] });
      setIsEditModalOpen(false);
      setNewUpdate({ title: '', description: '', image_url: '', category: 'GENERAL' });
    }
  });

  const nextSlide = () => updates && setSlideIndex((prev) => (prev + 1) % updates.length);
  const prevSlide = () => updates && setSlideIndex((prev) => (prev - 1 + updates.length) % updates.length);

  return (
    <div className="min-h-screen bg-[#FAFAF9] selection:bg-saffron-500 pb-24 font-sans overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      <div className="relative pt-32 pb-40 lg:pt-48 lg:pb-56 overflow-hidden bg-trustBlue-900">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-saffron-600/30 blur-[120px]" />
        <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: noiseBase64 }}></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-saffron-300 text-sm font-medium mb-8">
            <Sparkles size={16} /> <span>MatlaMala Palli Community Portal</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 italic">
            MMP<span className="text-saffron-400 not-italic">Palli</span>
          </h1>
          <p className="max-w-xl mx-auto text-xl text-trustBlue-100/80 font-light leading-relaxed">
            Real-time transparency for foundation funds, village infrastructure, and community milestones.
          </p>
        </div>
      </div>

      {/* --- MAIN CARDS --- */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 -mt-24 lg:-mt-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
          {/* Foundation Card */}
          <Link to="/foundation">
            <div className="group h-full bg-white rounded-[2.5rem] p-10 shadow-xl border border-white hover:shadow-saffron-500/10 transition-all border-l-[8px] border-l-saffron-500">
              <div className="w-14 h-14 rounded-2xl bg-saffron-50 flex items-center justify-center mb-6 shadow-inner"><Landmark className="text-saffron-600" /></div>
              <h2 className="text-3xl font-black text-slate-900 mb-2 italic">Foundation</h2>
              <p className="text-slate-500 mb-8 leading-relaxed">Track member monthly contributions and trust expenses.</p>
              <div className="flex items-center text-saffron-600 font-bold">Open Ledger <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" /></div>
            </div>
          </Link>

          {/* Village Accounts Card */}
          <Link to="/village-accounts">
            <div className="group h-full bg-white rounded-[2.5rem] p-10 shadow-xl border border-white hover:shadow-emerald-500/10 transition-all border-l-[8px] border-l-emerald-500">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 shadow-inner"><Tent className="text-emerald-600" /></div>
              <h2 className="text-3xl font-black text-slate-900 mb-2 italic">Village Accounts</h2>
              <p className="text-slate-500 mb-8 leading-relaxed">Monitor pond auctions, govt funds, and public projects.</p>
              <div className="flex items-center text-emerald-600 font-bold">Open Ledger <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" /></div>
            </div>
          </Link>
        </div>

        {/* --- VILLAGE UPDATES SLIDESHOW SECTION --- */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-saffron-500 text-white rounded-2xl shadow-lg shadow-saffron-500/20"><Bell size={24} /></div>
              <h2 className="text-4xl font-black text-slate-900 italic tracking-tight uppercase">Village Updates</h2>
            </div>
            
            {isAdmin && (
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl"
              >
                <Settings size={18} /> Edit Spotlight
              </button>
            )}
          </div>

          {!isLoading && updates?.length > 0 ? (
            <div className="relative bg-slate-900 rounded-[3rem] overflow-hidden h-[550px] shadow-2xl group/slide border border-white/5">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={slideIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col lg:flex-row"
                >
                  <div className="w-full lg:w-1/2 h-1/2 lg:h-full border-b lg:border-b-0 lg:border-r border-white/10">
                    <img src={updates[slideIndex].image_url} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="w-full lg:w-1/2 h-1/2 lg:h-full p-12 lg:p-20 flex flex-col justify-center text-white relative">
                    <Quote className="text-saffron-500/10 absolute top-10 left-10" size={120} />
                    <span className="text-saffron-400 font-black text-xs uppercase tracking-[0.3em] mb-4 bg-white/5 inline-block w-fit px-3 py-1 rounded-md">
                      {updates[slideIndex].category}
                    </span>
                    <h3 className="text-4xl lg:text-5xl font-black mb-6 leading-tight italic">
                      {updates[slideIndex].title}
                    </h3>
                    <p className="text-slate-400 text-lg leading-relaxed font-light">
                      {updates[slideIndex].description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              <div className="absolute bottom-10 right-10 flex gap-3 z-30">
                <button onClick={prevSlide} className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl backdrop-blur-md transition-all"><ChevronLeft /></button>
                <button onClick={nextSlide} className="p-4 bg-saffron-500 hover:bg-saffron-600 text-white rounded-2xl shadow-lg transition-all"><ChevronRight /></button>
              </div>
            </div>
          ) : (
            <div className="h-[300px] rounded-[3rem] bg-slate-100 flex items-center justify-center text-slate-400 italic border-2 border-dashed border-slate-200">
              No updates logged yet.
            </div>
          )}
        </div>
      </div>

      {/* --- ADMIN EDIT MODAL --- */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl p-10 overflow-hidden border border-white/20">
              
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-black italic tracking-tight">Create <span className="text-saffron-500 not-italic">Spotlight</span></h3>
                <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X /></button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update Title</label>
                    <input value={newUpdate.title} onChange={e => setNewUpdate({...newUpdate, title: e.target.value})} type="text" placeholder="Happy Birthday Mohan!" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-saffron-500 transition-all font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                    <select value={newUpdate.category} onChange={e => setNewUpdate({...newUpdate, category: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-black text-slate-700">
                      <option value="BIRTHDAY">Birthday 🎂</option>
                      <option value="MARRIAGE">Marriage 💍</option>
                      <option value="FESTIVAL">Festival 🏮</option>
                      <option value="GENERAL">General News 📢</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                  <textarea value={newUpdate.description} onChange={e => setNewUpdate({...newUpdate, description: e.target.value})} rows={3} placeholder="Write a short note for the village..." className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-saffron-500 transition-all" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update Photo</label>
                  
                  {/* Hidden Input triggered by the Camera icon */}
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="shrink-0 p-6 bg-saffron-50 text-saffron-600 rounded-[2rem] hover:bg-saffron-100 transition-all border-2 border-dashed border-saffron-200 flex flex-col items-center gap-1 group active:scale-95"
                    >
                      <Camera size={28} className="group-hover:scale-110 transition-transform" />
                      <span className="text-[9px] font-black uppercase tracking-tighter">Upload</span>
                    </button>

                    <div className="flex-grow space-y-3">
                      <input value={newUpdate.image_url} onChange={e => setNewUpdate({...newUpdate, image_url: e.target.value})} type="text" placeholder="Or paste an image URL here..." className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-saffron-500 text-sm" />
                      
                      {/* Image Preview */}
                      {newUpdate.image_url && (
                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-xl group">
                          <img src={newUpdate.image_url} className="w-full h-full object-cover" alt="Preview" />
                          <button onClick={() => setNewUpdate({...newUpdate, image_url: ''})} className="absolute inset-0 bg-rose-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><X size={20}/></button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => addMutation.mutate(newUpdate)}
                  className="w-full py-5 bg-slate-900 text-white font-black text-lg rounded-[2rem] shadow-2xl hover:bg-slate-800 transition-all mt-4 uppercase tracking-widest disabled:opacity-50"
                  disabled={addMutation.isPending || !newUpdate.title}
                >
                  {addMutation.isPending ? 'Publishing...' : 'Add Spotlight'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}