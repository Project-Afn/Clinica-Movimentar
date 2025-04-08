import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import RecordCard from '@/components/RecordCard';
import RecordForm from '@/components/RecordForm';
import { User, FileText, Plus, PlusCircle } from 'lucide-react';
import { Patient, User as UserType, MedicalRecord } from '@/lib/types';
import { getPatientById } from '@/services/patientService';
import { getPatientRecords } from '@/services/recordService';
import { useAuth } from '@/contexts/AuthContext';

const PatientDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [showNewRecordForm, setShowNewRecordForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        navigate('/patients');
        return;
      }

      try {
        setIsLoading(true);
        console.log('Buscando dados do paciente:', id);
        const [patientData, patientRecords] = await Promise.all([
          getPatientById(id),
          getPatientRecords(id)
        ]);
        
        console.log('Dados do paciente:', patientData);
        console.log('Prontuários recebidos:', patientRecords);
        
        if (!patientData) {
          throw new Error('Paciente não encontrado');
        }

        setPatient(patientData);
        
        if (patientRecords && patientRecords.length > 0) {
          console.log('Ordenando prontuários...');
          const sortedRecords = patientRecords.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          console.log('Prontuários ordenados:', sortedRecords);
          setRecords(sortedRecords);
        } else {
          console.log('Nenhum prontuário encontrado');
          setRecords([]);
        }
      } catch (error: any) {
        console.error('Erro ao buscar dados:', error);
        toast({
          title: 'Erro ao buscar dados',
          description: error.message || 'Ocorreu um erro ao carregar os dados do paciente',
          variant: 'destructive'
        });
        navigate('/patients');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate, id, toast]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddRecordSuccess = async () => {
    setShowNewRecordForm(false);
    
    try {
      if (id) {
        const patientRecords = await getPatientRecords(id);
        setRecords(patientRecords.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
        
        toast({
          title: 'Prontuário adicionado',
          description: 'Prontuário foi adicionado com sucesso'
        });
      }
    } catch (error: any) {
      console.error('Erro ao atualizar lista de prontuários:', error);
      toast({
        title: 'Erro ao atualizar lista',
        description: 'Não foi possível atualizar a lista de prontuários',
        variant: 'destructive'
      });
    }
  };

  // Format date to Brazilian format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  if (!user || isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-grow p-4 sm:p-6">
          <div className="app-container">
            <div className="text-center p-8">
              <p>Carregando...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-grow p-4 sm:p-6">
          <div className="app-container">
            <div className="text-center p-8">
              <p>Paciente não encontrado</p>
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
                  currentUser={user}
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
                    <p className="text-sm text-gray-500"><span className="font-medium">Endereço:</span> {patient.address ? `${patient.address.street}, ${patient.address.number} - ${patient.address.city}/${patient.address.state}` : 'Não informado'}</p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Cadastrado em:</span> {formatDate(patient.createdAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  Histórico de Prontuários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {records.length > 0 ? (
                    records.map(record => {
                      console.log('Renderizando prontuário:', record);
                      return (
                        <div key={record.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{record.diagnosis}</h3>
                            <span className="text-sm text-gray-500">{formatDate(record.createdAt)}</span>
                          </div>
                          <div className="mb-2">
                            <p className="text-sm font-medium">Tratamento:</p>
                            <p className="text-sm whitespace-pre-line">{record.treatment}</p>
                          </div>
                          {record.notes && (
                            <div className="mb-2">
                              <p className="text-sm font-medium">Observações:</p>
                              <p className="text-sm whitespace-pre-line">{record.notes}</p>
                            </div>
                          )}
                          <div className="text-xs text-gray-500">
                            <p>Fisioterapeuta: {record.therapistName}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center text-gray-500">Nenhum prontuário registrado</p>
                  )}
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
