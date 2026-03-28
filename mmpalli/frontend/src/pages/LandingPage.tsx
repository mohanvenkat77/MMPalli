import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNewsHighlights } from '../hooks/useNewsHighlights';
import { ArrowRight, Landmark, Tent, Bell, Sparkles, ChevronRight } from 'lucide-react';

// Animation Variants for reusability
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function LandingPage() {
  const { data: newsData, isLoading } = useNewsHighlights('2025-01');

  return (
    <div className="min-h-screen bg-[#FAFAF9] selection:bg-saffron-500 selection:text-white pb-24 font-sans overflow-hidden">
      
      {/* 1. HERO SECTION (Modern Mesh Gradient + Grid) */}
      <div className="relative pt-32 pb-40 lg:pt-48 lg:pb-56 overflow-hidden bg-trustBlue-900">
        {/* Animated Background Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-saffron-600/30 blur-[120px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-emerald-500/20 blur-[120px]"
        />
        
        {/* Subtle Grid overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          {/* Top Pill Badge */}
          <motion.div variants={fadeInUp} className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-saffron-300 text-sm font-medium">
              <Sparkles size={16} />
              <span>Financial Transparency Portal v2.0</span>
            </div>
          </motion.div>

    <motion.div variants={fadeInUp} className="relative z-20">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tight mb-8 drop-shadow-lg">
              Welcome to <br className="hidden md:block"/>
              <span className="text-saffron-400 drop-shadow-[0_0_20px_rgba(249,115,22,0.8)]">
                MatlaMala Palli
              </span>
            </h1>
          </motion.div>

          <motion.p variants={fadeInUp} className="max-w-2xl mx-auto text-xl text-trustBlue-100/80 font-light leading-relaxed mb-12">
            The official community dashboard for tracking foundation funds, village infrastructure, and pond auction revenues in real-time.
          </motion.p>
        </motion.div>
      </div>

      {/* 2. MAIN CONTENT (Lifted up with negative margin) */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 lg:-mt-32">
        
        {/* Interactive CTA Cards */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 mb-24"
        >
          {/* Foundation Card */}
          <Link to="/foundation">
            <motion.div 
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group h-full bg-white/80 backdrop-blur-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(249,115,22,0.1)] rounded-[2rem] p-8 lg:p-10 transition-all duration-500 overflow-hidden relative"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-saffron-100 to-saffron-50 flex items-center justify-center mb-8 shadow-inner border border-saffron-100/50">
                <Landmark className="w-8 h-8 text-saffron-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Jai Bheem Foundation</h2>
              <p className="text-slate-500 mb-8 leading-relaxed text-lg">Access the member register, track monthly contributions, and monitor foundation expenses.</p>
              
              <div className="flex items-center text-saffron-600 font-bold group-hover:text-saffron-700">
                Open Foundation Ledger 
                <div className="ml-2">
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Village Card */}
          <Link to="/village">
            <motion.div 
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group h-full bg-white/80 backdrop-blur-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(30,58,95,0.1)] rounded-[2rem] p-8 lg:p-10 transition-all duration-500 overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-trustBlue-50 to-blue-50 flex items-center justify-center mb-8 shadow-inner border border-trustBlue-100/50">
                <Tent className="w-8 h-8 text-trustBlue-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Village Accounts</h2>
              <p className="text-slate-500 mb-8 leading-relaxed text-lg">Monitor grand pond auction revenues, government funds, and festival expenditures.</p>
              
              <div className="flex items-center text-trustBlue-600 font-bold group-hover:text-trustBlue-700">
                Open Village Ledger
                <div className="ml-2">
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* 3. NEWS SECTION (Staggered Grid) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-saffron-100 rounded-lg text-saffron-600">
                <Bell size={24} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Village Updates</h2>
            </div>
            <button className="text-trustBlue-600 font-semibold hover:text-trustBlue-800 flex items-center gap-1 transition-colors">
              View all <ChevronRight size={18} />
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-saffron-200 border-t-saffron-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsData?.data?.map((news: any, index: number) => (
                <motion.div 
                  key={news._id} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-saffron-100 transition-all duration-300 group"
                >
                  <span className={`text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 inline-block ${
                    news.highlight_type === 'ACHIEVEMENT' ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' : 
                    news.highlight_type === 'EVENT' ? 'text-saffron-700 bg-saffron-50 border border-saffron-100' : 
                    'text-trustBlue-700 bg-trustBlue-50 border border-trustBlue-100'
                  }`}>
                    {news.highlight_type}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-trustBlue-900 transition-colors line-clamp-2">{news.title}</h3>
                  <p className="text-slate-500 leading-relaxed line-clamp-3">{news.description}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}