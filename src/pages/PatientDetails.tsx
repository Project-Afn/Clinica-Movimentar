import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Patient } from '@/lib/types';
import { getPatientById } from '@/services/patientService';
import { useAuth } from '@/contexts/AuthContext';

const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) return;
      
      try {
        const data = await getPatientById(id);
        setPatient(data);
      } catch (error) {
        console.error('Erro ao buscar paciente:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="p-4">
          <Button variant="ghost" onClick={() => navigate('/patients')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
        <main className="flex-grow p-4 sm:p-6">
          <div className="app-container">
            <div className="text-center p-8">
              <p>Carregando dados do paciente...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="p-4">
          <Button variant="ghost" onClick={() => navigate('/patients')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
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
      <div className="p-4">
        <Button variant="ghost" onClick={() => navigate('/patients')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>
      <main className="flex-grow p-4 sm:p-6">
        <div className="app-container max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold mb-6">{patient.name}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Informações Pessoais</h2>
                <div className="space-y-2">
                  <p><span className="font-medium">CPF:</span> {patient.cpf}</p>
                  <p><span className="font-medium">Data de Nascimento:</span> {new Date(patient.birthDate).toLocaleDateString()}</p>
                  <p><span className="font-medium">Gênero:</span> {patient.gender}</p>
                  <p><span className="font-medium">Telefone:</span> {patient.phone}</p>
                  <p><span className="font-medium">Email:</span> {patient.email}</p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">Endereço</h2>
                <div className="space-y-2">
                  <p><span className="font-medium">CEP:</span> {patient.address.cep}</p>
                  <p><span className="font-medium">Rua:</span> {patient.address.street}</p>
                  <p><span className="font-medium">Número:</span> {patient.address.number}</p>
                  <p><span className="font-medium">Complemento:</span> {patient.address.complement || 'N/A'}</p>
                  <p><span className="font-medium">Bairro:</span> {patient.address.neighborhood}</p>
                  <p><span className="font-medium">Cidade:</span> {patient.address.city}</p>
                  <p><span className="font-medium">Estado:</span> {patient.address.state}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Informações Médicas</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Plano de Saúde:</span> {patient.healthInsurance || 'N/A'}</p>
                <p><span className="font-medium">Número do Plano:</span> {patient.healthInsuranceNumber || 'N/A'}</p>
                <p><span className="font-medium">Alergias:</span> {patient.allergies || 'Nenhuma'}</p>
                <p><span className="font-medium">Medicações:</span> {patient.medications || 'Nenhuma'}</p>
                <p><span className="font-medium">Condições Médicas:</span> {patient.medicalConditions || 'Nenhuma'}</p>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Observações</h2>
              <p className="text-gray-600">{patient.notes || 'Nenhuma observação registrada.'}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDetails; 