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
import AmbedhkarJayanthiPage from './pages/AmbedhkarJayanthiPage';
import VillageAccountsPage from './pages/VillageAccountsPage';
import VillageUpdatesPage from './pages/VillageUpdatesPage';

function FloatingAdminButton() {
  const { isAdmin, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => (isAdmin ? logout() : setIsModalOpen(true))}
        className={`fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full border text-white shadow-[0_18px_40px_rgba(28,23,20,0.2)] transition hover:-translate-y-0.5 ${
          isAdmin
            ? 'border-emerald-300/40 bg-emerald-600 hover:bg-emerald-700'
            : 'border-white/30 bg-[color:var(--navy)] hover:bg-[#22463f]'
        }`}
        aria-label={isAdmin ? 'Logout admin' : 'Open admin login'}
      >
        {isAdmin ? <Unlock size={22} /> : <Lock size={22} />}
      </button>
      <AdminLoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="relative flex min-h-screen flex-col text-slate-900">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/foundation" element={<FoundationPage />} />
            <Route path="/ambedhkar-jayanthi" element={<AmbedhkarJayanthiPage />} />
            <Route path="/members" element={<MemberDirectory />} />
            <Route path="/bulk-collection" element={<BulkCollectionPage />} />
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

