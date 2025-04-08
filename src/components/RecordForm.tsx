
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addMedicalRecord, mockUsers } from '@/lib/mockData';
import { User } from '@/lib/types';

interface RecordFormProps {
  patientId: string;
  patientName: string;
  currentUser: User;
  onSuccess?: () => void;
}

const RecordForm: React.FC<RecordFormProps> = ({ patientId, patientName, currentUser, onSuccess }) => {
  const [formData, setFormData] = useState({
    description: '',
    observations: '',
    therapistId: currentUser.id
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [therapists, setTherapists] = useState<User[]>([]);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get only physiotherapist users
    const physiotherapists = mockUsers.filter(user => user.role === 'physiotherapist');
    setTherapists(physiotherapists);
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, therapistId: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description || !formData.therapistId) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos obrigatórios',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      setTimeout(() => {
        addMedicalRecord({
          ...formData,
          patientId
        });
        
        toast({
          title: 'Prontuário registrado',
          description: 'O prontuário foi registrado com sucesso'
        });
        
        if (onSuccess) {
          onSuccess();
        } else {
          navigate(`/patients/${patientId}`);
        }
      }, 1000);
    } catch (error) {
      toast({
        title: 'Erro ao registrar',
        description: 'Ocorreu um erro ao registrar o prontuário',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo Prontuário - {patientName}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea 
              id="description" 
              name="description"
              value={formData.description}
              onChange={handleTextChange}
              placeholder="Descrição do atendimento"
              required
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="observations">Observações</Label>
            <Textarea 
              id="observations" 
              name="observations"
              value={formData.observations}
              onChange={handleTextChange}
              placeholder="Observações detalhadas, diagnóstico, procedimentos realizados..."
              rows={5}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="therapistId">Fisioterapeuta Responsável *</Label>
            <Select 
              defaultValue={currentUser.id} 
              onValueChange={handleSelectChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o fisioterapeuta" />
              </SelectTrigger>
              <SelectContent>
                {therapists.map(therapist => (
                  <SelectItem key={therapist.id} value={therapist.id}>
                    {therapist.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate(`/patients/${patientId}`)}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar Prontuário'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default RecordForm;
