
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import PatientCard from '@/components/PatientCard';
import { PlusCircle, Search } from 'lucide-react';
import { getPatients } from '@/lib/mockData';
import { Patient, User } from '@/lib/types';

const Patients: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('movi-care-user');
    if (!storedUser) {
      navigate('/');
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      
      // Get all patients
      const allPatients = getPatients();
      setPatients(allPatients);
      setFilteredPatients(allPatients);
    } catch (error) {
      localStorage.removeItem('movi-care-user');
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    // Filter patients based on search query
    if (searchQuery.trim() === '') {
      setFilteredPatients(patients);
    } else {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = patients.filter(
        patient => 
          patient.name.toLowerCase().includes(lowercaseQuery) ||
          patient.cpf.includes(lowercaseQuery) ||
          (patient.phone && patient.phone.includes(lowercaseQuery))
      );
      setFilteredPatients(filtered);
    }
  }, [searchQuery, patients]);

  const handleLogout = () => {
    localStorage.removeItem('movi-care-user');
    navigate('/');
  };

  if (!currentUser) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar 
        userName={currentUser.name} 
        userRole={currentUser.role === 'admin' ? 'Administrador' : 'Fisioterapeuta'} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-grow p-4 sm:p-6">
        <div className="app-container">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h1 className="text-2xl font-bold mb-2 sm:mb-0">Pacientes</h1>
            <Button onClick={() => navigate('/patients/new')} className="flex items-center">
              <PlusCircle className="h-4 w-4 mr-2" />
              Novo Paciente
            </Button>
          </div>
          
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9"
              placeholder="Buscar por nome, CPF ou telefone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {filteredPatients.length > 0 ? (
            <div className="card-grid">
              {filteredPatients.map(patient => (
                <PatientCard key={patient.id} patient={patient} />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-white rounded-lg shadow-sm">
              {searchQuery ? (
                <div>
                  <p className="text-lg font-medium">Nenhum paciente encontrado</p>
                  <p className="text-gray-500">Tente buscar com outros termos</p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium">Nenhum paciente cadastrado</p>
                  <p className="text-gray-500 mb-4">Comece cadastrando seu primeiro paciente</p>
                  <Button onClick={() => navigate('/patients/new')}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Novo Paciente
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <footer className="bg-white border-t py-4 text-center text-sm text-gray-500">
        <p>© 2025 Clínica Movimentar - Todos os direitos reservados</p>
      </footer>
    </div>
  );
};

export default Patients;
