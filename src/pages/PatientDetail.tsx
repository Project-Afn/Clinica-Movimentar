
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import RecordCard from '@/components/RecordCard';
import RecordForm from '@/components/RecordForm';
import { User, FileText, Plus, PlusCircle } from 'lucide-react';
import { getPatientById, getPatientRecords } from '@/lib/mockData';
import { Patient, User as UserType, MedicalRecord } from '@/lib/types';

const PatientDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [showNewRecordForm, setShowNewRecordForm] = useState(false);

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
      
      if (!id) {
        navigate('/patients');
        return;
      }
      
      // Get patient and their records
      const patientData = getPatientById(id);
      if (!patientData) {
        toast({
          title: 'Paciente não encontrado',
          description: 'O paciente solicitado não foi encontrado',
          variant: 'destructive'
        });
        navigate('/patients');
        return;
      }
      
      setPatient(patientData);
      
      const patientRecords = getPatientRecords(id);
      const sortedRecords = [...patientRecords].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRecords(sortedRecords);
    } catch (error) {
      localStorage.removeItem('movi-care-user');
      navigate('/');
    }
  }, [navigate, id, toast]);

  const handleLogout = () => {
    localStorage.removeItem('movi-care-user');
    navigate('/');
  };

  const handleAddRecordSuccess = () => {
    setShowNewRecordForm(false);
    
    // Refresh records list
    if (id) {
      const patientRecords = getPatientRecords(id);
      const sortedRecords = [...patientRecords].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRecords(sortedRecords);
      
      toast({
        title: 'Prontuário adicionado',
        description: 'Prontuário foi adicionado com sucesso'
      });
    }
  };

  // Format date to Brazilian format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  if (!currentUser || !patient) {
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
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <div>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/patients')}
                  className="mb-2 p-0 h-auto text-gray-500 hover:text-gray-700"
                >
                  ← Voltar para Pacientes
                </Button>
                <h1 className="text-2xl font-bold">Informações do Paciente</h1>
              </div>
              <Button 
                onClick={() => setShowNewRecordForm(!showNewRecordForm)}
                className="mt-2 sm:mt-0"
              >
                {showNewRecordForm ? (
                  <>Cancelar</>
                ) : (
                  <>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Novo Prontuário
                  </>
                )}
              </Button>
            </div>
            
            {showNewRecordForm && (
              <div className="mb-6">
                <RecordForm 
                  patientId={patient.id} 
                  patientName={patient.name}
                  currentUser={currentUser}
                  onSuccess={handleAddRecordSuccess}
                />
              </div>
            )}
            
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <User className="h-5 w-5 mr-2 text-primary" />
                  Dados do Paciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500"><span className="font-medium">Nome completo:</span> {patient.name}</p>
                    <p className="text-sm text-gray-500"><span className="font-medium">CPF:</span> {patient.cpf}</p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Data de nascimento:</span> {formatDate(patient.birthDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500"><span className="font-medium">Telefone:</span> {patient.phone || 'Não informado'}</p>
                    <p className="text-sm text-gray-500"><span className="font-medium">Endereço:</span> {patient.address || 'Não informado'}</p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Cadastrado em:</span> {formatDate(patient.createdAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div>
              <div className="flex items-center mb-4">
                <FileText className="h-5 w-5 mr-2" />
                <h2 className="text-xl font-bold">Prontuários</h2>
              </div>
              
              {records.length > 0 ? (
                <div className="space-y-4">
                  {records.map(record => (
                    <RecordCard key={record.id} record={record} />
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 bg-white rounded-lg shadow-sm">
                  <p className="text-lg font-medium">Nenhum prontuário registrado</p>
                  <p className="text-gray-500 mb-4">Adicione o primeiro prontuário para este paciente</p>
                  <Button onClick={() => setShowNewRecordForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Prontuário
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t py-4 text-center text-sm text-gray-500">
        <p>© 2025 Clínica Movimentar - Todos os direitos reservados</p>
      </footer>
    </div>
  );
};

export default PatientDetail;
