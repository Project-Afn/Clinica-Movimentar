import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('movi-care-user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('movi-care-user', JSON.stringify(userData));
    if (userData.token) {
      localStorage.setItem('movi-care-token', userData.token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('movi-care-user');
    localStorage.removeItem('movi-care-token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 