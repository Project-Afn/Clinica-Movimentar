import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();

  console.log('ProtectedRoute - Token:', localStorage.getItem('movi-care-token'));
  console.log('ProtectedRoute - Current path:', location.pathname);

  if (!user) {
    console.log('ProtectedRoute - No user found, redirecting to login');
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 