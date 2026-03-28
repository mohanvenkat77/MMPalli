import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import FoundationPage from './pages/FoundationPage';
import VillagePage from './pages/VillagePage';
import AdminLoginModal from './components/admin/AdminLoginModal';
import { Lock, Unlock } from 'lucide-react';

// We separate this component so it can use the useAuth hook (which must be inside AuthProvider)
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
        title={isAdmin ? "Logout Admin" : "Admin Login"}
      >
        {isAdmin ? <Unlock size={24} /> : <Lock size={24} />}
      </button>

      <AdminLoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans relative">
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/foundation" element={<FoundationPage />} />
            <Route path="/village" element={<VillagePage />} />
          </Routes>
        </main>
        
        {/* The floating lock button */}
        <FloatingAdminButton />
      </div>
    </AuthProvider>
  );
}

export default App;