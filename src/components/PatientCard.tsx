
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, FileText } from 'lucide-react';
import { Patient } from '@/lib/types';

interface PatientCardProps {
  patient: Patient;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient }) => {
  const navigate = useNavigate();

  // Function to calculate age from birth date
  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // Format date to Brazilian format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <User className="h-5 w-5 mr-2 text-primary" />
          {patient.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-sm text-gray-500 space-y-2">
          <p><span className="font-medium">CPF:</span> {patient.cpf}</p>
          <p>
            <span className="font-medium">Nascimento:</span> {formatDate(patient.birthDate)} 
            <span className="ml-1 text-xs">({calculateAge(patient.birthDate)} anos)</span>
          </p>
          <p><span className="font-medium">Telefone:</span> {patient.phone || 'Não informado'}</p>
          <p className="line-clamp-2">
            <span className="font-medium">Endereço:</span> {patient.address || 'Não informado'}
          </p>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between border-t">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs"
          onClick={() => navigate(`/records/new/${patient.id}`)}
        >
          <FileText className="h-3.5 w-3.5 mr-1" />
          Novo Prontuário
        </Button>
        <Button 
          size="sm" 
          className="text-xs"
          onClick={() => navigate(`/patients/${patient.id}`)}
        >
          Ver Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PatientCard;
