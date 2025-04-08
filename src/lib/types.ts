export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'physiotherapist';
  token?: string;
}

export interface Address {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface Patient {
  id: string;
  name: string;
  cpf: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email: string;
  address: Address;
  healthInsurance?: string;
  healthInsuranceNumber?: string;
  allergies?: string;
  medications?: string;
  medicalConditions?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  therapistId: string;
  therapistName: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
