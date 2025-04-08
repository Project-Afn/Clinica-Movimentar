
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, FileText } from 'lucide-react';
import { getPatientById, mockMedicalRecords } from '@/lib/mockData';
import { User, MedicalRecord } from '@/lib/types';

const Records: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([]);
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
      
      // Get all records and sort by date descending
      const sortedRecords = [...mockMedicalRecords].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRecords(sortedRecords);
      setFilteredRecords(sortedRecords);
    } catch (error) {
      localStorage.removeItem('movi-care-user');
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    // Filter records based on search query
    if (searchQuery.trim() === '') {
      setFilteredRecords(records);
    } else {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = records.filter(
        record => 
          record.description.toLowerCase().includes(lowercaseQuery) ||
          record.observations.toLowerCase().includes(lowercaseQuery) ||
          record.therapistName.toLowerCase().includes(lowercaseQuery)
      );
      setFilteredRecords(filtered);
    }
  }, [searchQuery, records]);

  const handleLogout = () => {
    localStorage.removeItem('movi-care-user');
    navigate('/');
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get patient name from ID
  const getPatientName = (patientId: string): string => {
    const patient = getPatientById(patientId);
    return patient ? patient.name : 'Paciente não encontrado';
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
            <h1 className="text-2xl font-bold mb-2 sm:mb-0">Prontuários</h1>
            <Button onClick={() => navigate('/patients')} className="flex items-center">
              Selecionar Paciente
            </Button>
          </div>
          
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9"
              placeholder="Buscar por descrição, observações ou fisioterapeuta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {filteredRecords.length > 0 ? (
            <div className="space-y-4">
              {filteredRecords.map(record => (
                <Card key={record.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/patients/${record.patientId}`)}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      {record.description}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2">
                      <p className="text-sm font-medium">Paciente: {getPatientName(record.patientId)}</p>
                    </div>
                    
                    {record.observations && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-700 line-clamp-2">{record.observations}</p>
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500 flex flex-wrap gap-x-4">
                      <p><span className="font-medium">Fisioterapeuta:</span> {record.therapistName}</p>
                      <p><span className="font-medium">Data:</span> {formatDate(record.createdAt)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-white rounded-lg shadow-sm">
              {searchQuery ? (
                <div>
                  <p className="text-lg font-medium">Nenhum prontuário encontrado</p>
                  <p className="text-gray-500">Tente buscar com outros termos</p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium">Nenhum prontuário registrado</p>
                  <p className="text-gray-500 mb-4">Selecione um paciente para adicionar um prontuário</p>
                  <Button onClick={() => navigate('/patients')}>
                    Selecionar Paciente
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

export default Records;
