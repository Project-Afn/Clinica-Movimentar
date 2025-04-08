import api from './api';
import { User, LoginCredentials } from '@/lib/types';

export const login = async (credentials: LoginCredentials): Promise<User> => {
  try {
    const response = await api.post('/users/login', credentials);
    
    if (response.data) {
      // Map the response data to match our User interface
      const userData: User = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        token: response.data.token
      };
      
      // Store only necessary user data in localStorage
      localStorage.setItem('movi-care-token', response.data.token);
      return userData;
    }
    throw new Error('Login failed');
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const logout = (): void => {
  localStorage.removeItem('movi-care-token');
};

export const getCurrentUser = async (): Promise<User | null> => {
  const token = localStorage.getItem('movi-care-token');
  if (!token) return null;

  try {
    const response = await api.get('/users/profile');
    return {
      id: response.data.id,
      name: response.data.name,
      email: response.data.email,
      token
    };
  } catch (error) {
    return null;
  }
};

export const registerUser = async (userData: Omit<User, 'id'> & { password: string }): Promise<User> => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const checkUserRole = async (): Promise<string> => {
  try {
    const response = await api.get('/users/profile');
    return response.data.role;
  } catch (error) {
    throw new Error('Failed to check user role');
  }
};
