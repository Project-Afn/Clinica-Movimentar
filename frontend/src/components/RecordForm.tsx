import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createRecord } from '@/services/recordService';
import { User } from '@/lib/types';
import api from '@/services/api';

interface RecordFormProps {
  patientId: string;
  patientName: string;
  currentUser: User;
  onSuccess?: () => void;
}

const RecordForm: React.FC<RecordFormProps> = ({ patientId, patientName, currentUser, onSuccess }) => {
  const [formData, setFormData] = useState({
    diagnosis: '',
    treatment: '',
    notes: '',
    therapistId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [therapists, setTherapists] = useState<User[]>([]);
  const [isLoadingTherapists, setIsLoadingTherapists] = useState(true);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchTherapists = async () => {
      setIsLoadingTherapists(true);
      try {
        console.log('Buscando fisioterapeutas...');
        const response = await api.get('/users');
        console.log('Resposta da API:', response.data);
        
        const physiotherapists = response.data
          .filter((user: User) => user.role === 'physiotherapist' && user._id)
          .map((user: User) => ({
            ...user,
            id: user._id || user.id
          }));
          
        console.log('Fisioterapeutas filtrados:', physiotherapists);
        
        setTherapists(physiotherapists);
        
        // Se o usuário atual é um fisioterapeuta, seleciona ele por padrão
        if (currentUser.role === 'physiotherapist' && (currentUser._id || currentUser.id)) {
          setFormData(prev => ({ ...prev, therapistId: currentUser._id || currentUser.id }));
        }
        // Senão, seleciona o primeiro da lista
        else if (physiotherapists.length > 0) {
          setFormData(prev => ({ ...prev, therapistId: physiotherapists[0].id }));
        }
      } catch (error) {
        console.error('Erro ao buscar fisioterapeutas:', error);
        toast({
          title: 'Erro ao carregar fisioterapeutas',
          description: 'Não foi possível carregar a lista de fisioterapeutas. Por favor, tente novamente.',
          variant: 'destructive'
        });
      } finally {
        setIsLoadingTherapists(false);
      }
    };
    
    fetchTherapists();
  }, [currentUser]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    console.log('Selecionando fisioterapeuta:', value);
    if (value && value !== 'undefined') {
      setFormData(prev => ({ ...prev, therapistId: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.diagnosis || !formData.treatment || !formData.therapistId) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos obrigatórios',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const selectedTherapist = therapists.find(t => t.id === formData.therapistId);
      
      if (!selectedTherapist) {
        throw new Error('Fisioterapeuta não encontrado');
      }
      
      await createRecord({
        patientId,
        patientName,
        therapistId: formData.therapistId,
        therapistName: selectedTherapist.name,
        diagnosis: formData.diagnosis,
        treatment: formData.treatment,
        notes: formData.notes
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
    } catch (error: any) {
      console.error('Erro ao registrar prontuário:', error);
      toast({
        title: 'Erro ao registrar',
        description: error.message || 'Ocorreu um erro ao registrar o prontuário',
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
            <Label htmlFor="diagnosis">Diagnóstico *</Label>
            <Textarea 
              id="diagnosis" 
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleTextChange}
              placeholder="Diagnóstico do paciente"
              required
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="treatment">Tratamento *</Label>
            <Textarea 
              id="treatment" 
              name="treatment"
              value={formData.treatment}
              onChange={handleTextChange}
              placeholder="Plano de tratamento"
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea 
              id="notes" 
              name="notes"
              value={formData.notes}
              onChange={handleTextChange}
              placeholder="Observações adicionais..."
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="therapistId">Fisioterapeuta Responsável *</Label>
            {therapists.length > 0 ? (
              <Select 
                defaultValue={formData.therapistId}
                value={formData.therapistId || undefined}
                onValueChange={handleSelectChange}
                disabled={isLoadingTherapists}
              >
                <SelectTrigger id="therapistId">
                  <SelectValue placeholder={isLoadingTherapists ? "Carregando..." : "Selecione o fisioterapeuta"} />
                </SelectTrigger>
                <SelectContent>
                  {therapists.map(therapist => (
                    <SelectItem 
                      key={therapist.id} 
                      value={therapist.id}
                    >
                      {therapist.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum fisioterapeuta encontrado</p>
            )}
            {isLoadingTherapists && (
              <p className="text-sm text-muted-foreground">Carregando lista de fisioterapeutas...</p>
            )}
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
          <Button type="submit" disabled={isSubmitting || isLoadingTherapists}>
            {isSubmitting ? 'Salvando...' : 'Salvar Prontuário'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default RecordForm;
