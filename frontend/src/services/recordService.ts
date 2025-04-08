import api from './api';
import { MedicalRecord } from '@/lib/types';

// Mapping function to transform backend format to frontend format
const mapRecord = (record: any): MedicalRecord => {
  console.log('Mapeando prontuário:', record);
  const mappedRecord = {
    id: record._id || record.id,
    patientId: record.patientId,
    patientName: record.patientName,
    diagnosis: record.diagnosis,
    treatment: record.treatment,
    notes: record.notes || '',
    therapistId: record.therapistId,
    therapistName: record.therapistName,
    createdAt: record.createdAt
  };
  console.log('Prontuário mapeado:', mappedRecord);
  return mappedRecord;
};

export const getRecords = async (): Promise<MedicalRecord[]> => {
  try {
    const response = await api.get('/records');
    return response.data.map(mapRecord);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao buscar prontuários');
  }
};

export const getPatientRecords = async (patientId: string): Promise<MedicalRecord[]> => {
  try {
    console.log('Buscando prontuários para o paciente:', patientId);
    const response = await api.get(`/records/patient/${patientId}`);
    console.log('Resposta da API para prontuários:', response.data);
    
    if (!response.data || !Array.isArray(response.data)) {
      console.error('Dados inválidos recebidos:', response.data);
      return [];
    }
    
    const mappedRecords = response.data.map(mapRecord);
    console.log('Prontuários mapeados:', mappedRecords);
    return mappedRecords;
  } catch (error: any) {
    console.error('Erro ao buscar prontuários:', error);
    throw new Error(error.response?.data?.message || 'Erro ao buscar prontuários do paciente');
  }
};

export const getRecordById = async (id: string): Promise<MedicalRecord> => {
  try {
    const response = await api.get(`/records/${id}`);
    return mapRecord(response.data);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao buscar prontuário');
  }
};

type CreateRecordInput = Omit<MedicalRecord, 'id' | 'createdAt' | 'updatedAt'>;

export const createRecord = async (data: CreateRecordInput): Promise<MedicalRecord> => {
  try {
    const response = await api.post('/records', data);
    return mapRecord(response.data);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao criar prontuário');
  }
};

export const updateRecord = async (id: string, data: Partial<MedicalRecord>): Promise<MedicalRecord> => {
  try {
    const response = await api.put(`/records/${id}`, data);
    return mapRecord(response.data);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao atualizar prontuário');
  }
};

export const deleteRecord = async (id: string): Promise<void> => {
  try {
    await api.delete(`/records/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao excluir prontuário');
  }
};
