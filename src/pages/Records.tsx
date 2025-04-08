import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, FileText } from 'lucide-react';
import { getRecords } from '@/services/recordService';
import { User, MedicalRecord } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

const Records: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await getRecords();
        // Sort records by date descending
        const sortedRecords = data.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRecords(sortedRecords);
        setFilteredRecords(sortedRecords);
      } catch (error) {
        console.error('Erro ao buscar prontuários:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRecords(records);
    } else {
      const filtered = records.filter(record => 
        record.patientName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRecords(filtered);
    }
  }, [searchQuery, records]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Format date to Brazilian format
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

  if (!user) {
    return null;
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
                <h1 className="text-2xl font-bold">Prontuários</h1>
                <p className="text-sm text-gray-500">Busque prontuários pelo nome do paciente</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Digite o nome do paciente..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {isLoading ? (
              <div className="text-center p-8">
                <p>Carregando prontuários...</p>
              </div>
            ) : filteredRecords.length > 0 ? (
              <div className="space-y-4">
                {filteredRecords.map(record => (
                  <Card key={record.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/patients/${record.patientId}`)}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-primary" />
                        {record.diagnosis}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-2">
                        <p className="text-sm font-medium">Paciente: {record.patientName}</p>
                      </div>
                      
                      {record.notes && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-700 line-clamp-2">{record.notes}</p>
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
                <p className="text-lg font-medium">
                  {searchQuery ? 'Nenhum prontuário encontrado para este paciente' : 'Nenhum prontuário registrado'}
                </p>
                {searchQuery && (
                  <p className="text-gray-500 mt-2">Tente buscar com outro nome</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t py-4 text-center text-sm text-gray-500">
        <p>© 2025 Clínica Movimentar - Todos os direitos reservados</p>
      </footer>
    </div>
  );
};

export default Records;
