
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'physiotherapist';
  token?: string;
}

export interface Patient {
  id: string;
  name: string;
  cpf: string;
  birthDate: string;
  phone: string;
  address: string;
  createdAt: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  description: string;
  observations: string;
  therapistId: string;
  therapistName: string;
  createdAt: string;
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
