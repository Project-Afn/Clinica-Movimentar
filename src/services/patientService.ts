import api from './api';
import { Patient } from '@/lib/types';

// Mapping function to transform backend format to frontend format
const mapPatient = (patient: any): Patient => ({
  id: patient._id || patient.id,
  name: patient.name,
  cpf: patient.cpf,
  birthDate: patient.birthDate,
  phone: patient.phone || '',
  address: patient.address || '',
  createdAt: patient.createdAt
});

export const getPatients = async (): Promise<Patient[]> => {
  try {
    const response = await api.get('/patients');
    return response.data.map(mapPatient);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get patients');
  }
};

export const getPatientById = async (id: string): Promise<Patient> => {
  try {
    const response = await api.get(`/patients/${id}`);
    return mapPatient(response.data);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get patient');
  }
};

export const createPatient = async (patient: Omit<Patient, 'id' | 'createdAt'>): Promise<Patient> => {
  try {
    const response = await api.post('/patients', patient);
    return mapPatient(response.data);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create patient');
  }
};

export const updatePatient = async (id: string, patient: Partial<Patient>): Promise<Patient> => {
  try {
    const response = await api.put(`/patients/${id}`, patient);
    return mapPatient(response.data);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update patient');
  }
};

export const deletePatient = async (id: string): Promise<void> => {
  try {
    await api.delete(`/patients/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete patient');
  }
};
