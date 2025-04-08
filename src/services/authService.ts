
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
        role: response.data.role,
        token: response.data.token,
      };
      
      // Store user data in localStorage
      localStorage.setItem('movi-care-user', JSON.stringify(userData));
      return userData;
    }
    throw new Error('Login failed');
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const logout = (): void => {
  localStorage.removeItem('movi-care-user');
};

export const getCurrentUser = (): User | null => {
  const userData = localStorage.getItem('movi-care-user');
  return userData ? JSON.parse(userData) : null;
};

export const registerUser = async (userData: Omit<User, 'id'> & { password: string }): Promise<User> => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};
