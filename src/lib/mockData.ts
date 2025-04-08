
import { User, Patient, MedicalRecord } from './types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@movimentar.com',
    role: 'admin'
  },
  {
    id: '2',
    name: 'Dr. Maria Silva',
    email: 'maria@movimentar.com',
    role: 'physiotherapist'
  },
  {
    id: '3',
    name: 'Dr. João Pereira',
    email: 'joao@movimentar.com',
    role: 'physiotherapist'
  }
];

export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Ana Santos',
    cpf: '123.456.789-00',
    birthDate: '1985-05-15',
    phone: '(11) 98765-4321',
    address: 'Rua das Flores, 123 - São Paulo, SP',
    createdAt: '2023-01-10T14:30:00Z'
  },
  {
    id: '2',
    name: 'Carlos Oliveira',
    cpf: '987.654.321-00',
    birthDate: '1978-11-22',
    phone: '(11) 91234-5678',
    address: 'Av. Paulista, 1000 - São Paulo, SP',
    createdAt: '2023-02-05T10:15:00Z'
  },
  {
    id: '3',
    name: 'Mariana Costa',
    cpf: '456.789.123-00',
    birthDate: '1990-07-30',
    phone: '(11) 95555-9999',
    address: 'Rua Augusta, 500 - São Paulo, SP',
    createdAt: '2023-03-20T16:45:00Z'
  },
  {
    id: '4',
    name: 'Roberto Almeida',
    cpf: '321.654.987-00',
    birthDate: '1965-03-12',
    phone: '(11) 92222-3333',
    address: 'Rua Oscar Freire, 200 - São Paulo, SP',
    createdAt: '2023-04-15T09:20:00Z'
  }
];

export const mockMedicalRecords: MedicalRecord[] = [
  {
    id: '1',
    patientId: '1',
    description: 'Avaliação inicial - Dor lombar',
    observations: 'Paciente relata dor lombar há 2 semanas. Recomendado exercícios de fortalecimento e alongamento.',
    therapistId: '2',
    therapistName: 'Dr. Maria Silva',
    createdAt: '2023-01-15T14:30:00Z'
  },
  {
    id: '2',
    patientId: '1',
    description: 'Sessão de fisioterapia - Tratamento lombar',
    observations: 'Paciente apresentou melhora significativa após exercícios. Continuar com o tratamento atual.',
    therapistId: '2',
    therapistName: 'Dr. Maria Silva',
    createdAt: '2023-01-22T15:00:00Z'
  },
  {
    id: '3',
    patientId: '2',
    description: 'Avaliação inicial - Recuperação pós-cirúrgica joelho',
    observations: 'Paciente em recuperação de artroscopia no joelho direito. Iniciado protocolo de reabilitação.',
    therapistId: '3',
    therapistName: 'Dr. João Pereira',
    createdAt: '2023-02-10T10:30:00Z'
  },
  {
    id: '4',
    patientId: '3',
    description: 'Avaliação inicial - Tendinite',
    observations: 'Paciente com tendinite no ombro direito. Iniciado tratamento com ultrassom e exercícios.',
    therapistId: '2',
    therapistName: 'Dr. Maria Silva',
    createdAt: '2023-03-22T11:15:00Z'
  }
];

export const loginUser = (email: string, password: string): User | null => {
  // For demo purposes, any password works with a valid email
  const user = mockUsers.find(u => u.email === email);
  return user || null;
};

export const getPatients = (): Patient[] => {
  return mockPatients;
};

export const getPatientById = (id: string): Patient | undefined => {
  return mockPatients.find(patient => patient.id === id);
};

export const getPatientRecords = (patientId: string): MedicalRecord[] => {
  return mockMedicalRecords.filter(record => record.patientId === patientId);
};

export const addPatient = (patient: Omit<Patient, 'id' | 'createdAt'>): Patient => {
  const newPatient: Patient = {
    ...patient,
    id: (mockPatients.length + 1).toString(),
    createdAt: new Date().toISOString()
  };
  mockPatients.push(newPatient);
  return newPatient;
};

export const addMedicalRecord = (record: Omit<MedicalRecord, 'id' | 'createdAt' | 'therapistName'>): MedicalRecord => {
  const therapist = mockUsers.find(user => user.id === record.therapistId);
  const newRecord: MedicalRecord = {
    ...record,
    id: (mockMedicalRecords.length + 1).toString(),
    therapistName: therapist?.name || 'Unknown',
    createdAt: new Date().toISOString()
  };
  mockMedicalRecords.push(newRecord);
  return newRecord;
};
