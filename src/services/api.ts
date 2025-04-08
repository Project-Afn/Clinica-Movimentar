import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('movi-care-token');
    console.log('Token encontrado:', token);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Headers da requisição:', config.headers);
    } else {
      console.log('Nenhum token encontrado');
    }
    
    return config;
  },
  (error) => {
    console.error('Erro no interceptor:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('Resposta da API:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Erro na resposta da API:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default api;
