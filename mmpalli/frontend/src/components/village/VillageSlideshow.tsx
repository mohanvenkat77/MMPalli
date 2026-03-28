import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export default function VillageSlideshow({ updates }: { updates: any[] }) {
  const [index, setIndex] = useState(0);

  if (!updates || updates.length === 0) return null;

  const next = () => setIndex((prev) => (prev + 1) % updates.length);
  const prev = () => setIndex((prev) => (prev - 1 + updates.length) % updates.length);

  const current = updates[index];

  return (
    <div className="relative w-full max-w-5xl mx-auto h-[500px] overflow-hidden rounded-[3rem] shadow-2xl bg-slate-900 group">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="absolute inset-0 flex flex-col md:flex-row"
        >
          {/* Image Part */}
          <div className="w-full md:w-1/2 h-full relative">
            <img 
              src={current.image_url || 'https://images.unsplash.com/photo-1518173946687-a4c8a9ba332f'} 
              className="w-full h-full object-cover"
              alt={current.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent md:hidden" />
          </div>

          {/* Text Part */}
          <div className="w-full md:w-1/2 p-12 flex flex-col justify-center text-white relative">
            <Quote className="text-saffron-500 mb-6 opacity-30" size={48} />
            <span className="text-saffron-400 font-black text-xs uppercase tracking-[0.3em] mb-4">
              {current.category}
            </span>
            <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">
              {current.title}
            </h2>
            <p className="text-slate-300 leading-relaxed text-lg">
              {current.description}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute bottom-10 right-10 flex gap-3 z-30">
        <button onClick={prev} className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl backdrop-blur-md transition-all">
          <ChevronLeft size={24} />
        </button>
        <button onClick={next} className="p-4 bg-saffron-500 hover:bg-saffron-600 text-white rounded-2xl shadow-lg transition-all">
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}