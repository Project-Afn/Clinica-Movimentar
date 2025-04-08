import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/AuthForm';
import { useToast } from '@/components/ui/use-toast';
import { User } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('movi-care-user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.token) {
          navigate('/dashboard');
        } else {
          localStorage.removeItem('movi-care-user');
          localStorage.removeItem('movi-care-token');
        }
      } catch (error) {
        // Invalid stored user, clear it
        localStorage.removeItem('movi-care-user');
        localStorage.removeItem('movi-care-token');
      }
    }
  }, [navigate]);

  const handleLogin = (token: string, userData: any) => {
    // Create user object with token
    const user: User = {
      ...userData,
      token
    };
    
    // Login using AuthContext
    login(user);
    
    toast({
      title: 'Login bem-sucedido',
      description: `Bem-vindo(a), ${user.name}!`
    });
    
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Clínica Movimentar</h1>
          <p className="text-gray-600">Sistema de Gestão de Pacientes e Prontuários</p>
        </div>
        
        <AuthForm onLogin={handleLogin} />
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Usuários para teste:</p>
          <p className="mono mt-1">admin@movimentar.com (Administrador)</p>
          <p className="mono">maria@movimentar.com (Fisioterapeuta)</p>
          <p className="mono">joao@movimentar.com (Fisioterapeuta)</p>
          <p className="mt-1">Qualquer senha funciona para estes usuários.</p>
        </div>
      </div>
      
      <footer className="py-4 text-center text-sm text-gray-500">
        <p>© 2025 Clínica Movimentar - Todos os direitos reservados</p>
      </footer>
    </div>
  );
};

export default Index;
