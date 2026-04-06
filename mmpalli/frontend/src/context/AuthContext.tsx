import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { setAdminApiKey } from '../config/api';

interface AuthContextType {
  isAdmin: boolean;
  login: (key: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if we already logged in previously
  useEffect(() => {
    const storedKey = localStorage.getItem('mmp_api_key');
    if (storedKey) {
      setAdminApiKey(storedKey);
      setIsAdmin(true);
    }
  }, []);

  const login = (key: string) => {
    localStorage.setItem('mmp_api_key', key);
    setAdminApiKey(key);
    setIsAdmin(true);
  };

  const logout = () => {
    localStorage.removeItem('mmp_api_key');
    setAdminApiKey('');
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
