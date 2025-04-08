import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import PatientCard from '@/components/PatientCard';
import { PlusCircle, Search } from 'lucide-react';
import { getPatients } from '@/services/patientService';
import { Patient, User } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

const Patients: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getPatients();
        setPatients(data);
        setFilteredPatients(data);
      } catch (error) {
        console.error('Erro ao buscar pacientes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
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

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar 
          userName={user.name} 
          userRole={user.role === 'admin' ? 'Administrador' : 'Fisioterapeuta'} 
          onLogout={logout}
        />
        <main className="flex-grow p-4 sm:p-6">
          <div className="app-container">
            <div className="text-center p-8">
              <p>Carregando pacientes...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar 
        userName={user.name} 
        userRole={user.role === 'admin' ? 'Administrador' : 'Fisioterapeuta'} 
        onLogout={logout}
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
