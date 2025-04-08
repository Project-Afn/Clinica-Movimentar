import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, PlusCircle } from 'lucide-react';
import { getPatients } from '@/services/patientService';
import { getRecords } from '@/services/recordService';
import { Patient, User, MedicalRecord } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
  const [recentRecords, setRecentRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar pacientes e prontuários
        const [patientsData, recordsData] = await Promise.all([
          getPatients(),
          getRecords()
        ]);

        // Ordenar pacientes por data de criação (mais recentes primeiro)
        const sortedPatients = [...patientsData].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRecentPatients(sortedPatients.slice(0, 3));

        // Ordenar prontuários por data de criação (mais recentes primeiro)
        const sortedRecords = [...recordsData].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRecentRecords(sortedRecords.slice(0, 3));
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
              <p>Carregando dados...</p>
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
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Bem-vindo(a), {user.name}!</h1>
            <p className="text-gray-600">Confira as informações recentes do sistema.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Pacientes Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentPatients.length > 0 ? (
                  <div className="space-y-3">
                    {recentPatients.map(patient => (
                      <div key={patient.id} className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer" onClick={() => navigate(`/patients/${patient.id}`)}>
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-gray-500">{patient.phone || 'Telefone não cadastrado'}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Nenhum paciente cadastrado ainda.</p>
                )}
                
                <div className="mt-4">
                  <Button 
                    onClick={() => navigate('/patients')}
                    variant="outline" 
                    className="w-full"
                  >
                    Ver Todos
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Prontuários Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentRecords.length > 0 ? (
                  <div className="space-y-3">
                    {recentRecords.map(record => (
                      <div key={record.id} className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer" onClick={() => navigate(`/patients/${record.patientId}`)}>
                        <div className="font-medium">{record.diagnosis}</div>
                        <div className="text-sm text-gray-500">Dr(a). {record.therapistName}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Nenhum prontuário cadastrado ainda.</p>
                )}
                
                <div className="mt-4">
                  <Button 
                    onClick={() => navigate('/records')}
                    variant="outline" 
                    className="w-full"
                  >
                    Ver Todos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/patients/new')}>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <PlusCircle className="h-12 w-12 mb-4 text-primary" />
                <h3 className="font-medium text-lg mb-1">Novo Paciente</h3>
                <p className="text-sm text-gray-500">Cadastrar um novo paciente no sistema</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/patients')}>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <Users className="h-12 w-12 mb-4 text-primary" />
                <h3 className="font-medium text-lg mb-1">Pacientes</h3>
                <p className="text-sm text-gray-500">Visualizar e gerenciar pacientes cadastrados</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/records')}>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <FileText className="h-12 w-12 mb-4 text-primary" />
                <h3 className="font-medium text-lg mb-1">Prontuários</h3>
                <p className="text-sm text-gray-500">Acessar o histórico de prontuários</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t py-4 text-center text-sm text-gray-500">
        <p>© 2025 Clínica Movimentar - Todos os direitos reservados</p>
      </footer>
    </div>
  );
};

export default Dashboard;
