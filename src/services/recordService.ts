import api from './api';
import { MedicalRecord } from '@/lib/types';

// Mapping function to transform backend format to frontend format
const mapRecord = (record: any): MedicalRecord => ({
  id: record._id,
  patientId: record.patientId,
  description: record.description,
  observations: record.observations || '',
  therapistId: record.therapistId,
  therapistName: record.therapistName,
  createdAt: record.createdAt
});

export const getRecords = async (): Promise<MedicalRecord[]> => {
  try {
    const response = await api.get('/records');
    return response.data.map(mapRecord);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get records');
  }
};

export const getPatientRecords = async (patientId: string): Promise<MedicalRecord[]> => {
  try {
    const response = await api.get(`/records/patient/${patientId}`);
    return response.data.map(mapRecord);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get patient records');
  }
};

export const getRecordById = async (id: string): Promise<MedicalRecord> => {
  try {
    const response = await api.get(`/records/${id}`);
    return mapRecord(response.data);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get record');
  }
};

export const createRecord = async (record: Omit<MedicalRecord, 'id' | 'therapistName' | 'createdAt'>): Promise<MedicalRecord> => {
  try {
    const response = await api.post('/records', record);
    return mapRecord(response.data);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create record');
  }
};

export const updateRecord = async (id: string, record: Partial<MedicalRecord>): Promise<MedicalRecord> => {
  try {
    const response = await api.put(`/records/${id}`, record);
    return mapRecord(response.data);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update record');
  }
};

export const deleteRecord = async (id: string): Promise<void> => {
  try {
    await api.delete(`/records/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete record');
  }
};
