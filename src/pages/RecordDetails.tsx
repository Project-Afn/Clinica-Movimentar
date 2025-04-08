import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { MedicalRecord } from '@/lib/types';
import { getRecordById } from '@/services/recordService';
import { useAuth } from '@/contexts/AuthContext';

const RecordDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [record, setRecord] = useState<MedicalRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecord = async () => {
      if (!id) return;
      
      try {
        const data = await getRecordById(id);
        setRecord(data);
      } catch (error) {
        console.error('Erro ao buscar prontuário:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="p-4">
          <Button variant="ghost" onClick={() => navigate('/records')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
        <main className="flex-grow p-4 sm:p-6">
          <div className="app-container">
            <div className="text-center p-8">
              <p>Carregando dados do prontuário...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="p-4">
          <Button variant="ghost" onClick={() => navigate('/records')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
        <main className="flex-grow p-4 sm:p-6">
          <div className="app-container">
            <div className="text-center p-8">
              <p>Prontuário não encontrado</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="p-4">
        <Button variant="ghost" onClick={() => navigate('/records')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>
      <main className="flex-grow p-4 sm:p-6">
        <div className="app-container max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold">Prontuário</h1>
                <p className="text-gray-500">Criado em {new Date(record.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">Paciente: {record.patientName}</p>
                <p className="text-gray-500">Fisioterapeuta: {record.therapistName}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Diagnóstico</h2>
                <p className="text-gray-600 whitespace-pre-wrap">{record.diagnosis}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">Tratamento</h2>
                <p className="text-gray-600 whitespace-pre-wrap">{record.treatment}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">Observações</h2>
                <p className="text-gray-600 whitespace-pre-wrap">{record.notes}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-500">
                Última atualização: {new Date(record.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecordDetails; 