import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MedicalRecord } from '@/lib/types';
import { FileText, User, Calendar } from 'lucide-react';

interface RecordCardProps {
  record: MedicalRecord;
  showPatientName?: boolean;
}

const RecordCard: React.FC<RecordCardProps> = ({ record, showPatientName = false }) => {
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

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <FileText className="h-5 w-5 mr-2 text-primary" />
          {record.diagnosis}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Tratamento:</p>
          <p className="text-sm whitespace-pre-line">{record.treatment}</p>
        </div>
        
        {record.notes && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Observações:</p>
            <p className="text-sm whitespace-pre-line">{record.notes}</p>
          </div>
        )}
        
        <div className="text-xs text-gray-500 space-y-1 pt-2 border-t">
          {showPatientName && (
            <p className="flex items-center">
              <User className="h-3.5 w-3.5 mr-1 inline" />
              <span className="font-medium mr-1">Paciente:</span>
              {record.patientName}
            </p>
          )}
          <p className="flex items-center">
            <User className="h-3.5 w-3.5 mr-1 inline" />
            <span className="font-medium mr-1">Fisioterapeuta:</span>
            {record.therapistName}
          </p>
          <p className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1 inline" />
            <span className="font-medium mr-1">Data:</span>
            {formatDate(record.createdAt)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecordCard;
