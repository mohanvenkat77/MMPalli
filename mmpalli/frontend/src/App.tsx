import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import FoundationPage from './pages/FoundationPage';
import MemberDirectory from './pages/MemberDirectory';
import BulkCollectionPage from './pages/BulkCollectionPage';
import AdminLoginModal from './components/admin/AdminLoginModal';
import { Lock, Unlock } from 'lucide-react';
import Footer from './components/shared/Footer';

// SEPARATE PAGE IMPORTS
import VillageAccountsPage from './pages/VillageAccountsPage';
import VillageUpdatesPage from './pages/VillageUpdatesPage';

function FloatingAdminButton() {
  const { isAdmin, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <button 
        onClick={() => isAdmin ? logout() : setIsModalOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl text-white transition-all duration-300 hover:scale-110 z-40 ${
          isAdmin ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-800 hover:bg-trustBlue-900'
        }`}
      >
        {isAdmin ? <Unlock size={24} /> : <Lock size={24} />}
      </button>
      <AdminLoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans relative flex flex-col">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/foundation" element={<FoundationPage />} />
            <Route path="/members" element={<MemberDirectory />} />
            <Route path="/bulk-collection" element={<BulkCollectionPage />} />
            
            {/* THE TWO SEPARATE VILLAGE ROUTES */}
            <Route path="/village-accounts" element={<VillageAccountsPage />} />
            <Route path="/village-updates" element={<VillageUpdatesPage />} />
          </Routes>
        </main>
        <Footer />
        <FloatingAdminButton />
      </div>
    </AuthProvider>
  );
}