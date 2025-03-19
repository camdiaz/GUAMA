import axios from 'axios';
import { Transaction } from '../types/Transaction';

const API_URL = 'http://localhost:8080/api/transactions';

// Configuración de Axios con interceptores para manejar errores
const apiClient = axios.create({
  baseURL: API_URL
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const api = {
  getAllTransactions: async (filters?: {name?: string, date?: string, status?: string}) => {
    const params = new URLSearchParams();
    if (filters?.name) params.append('name', filters.name);
    if (filters?.date) params.append('date', filters.date);
    if (filters?.status) params.append('status', filters.status);
    
    const response = await apiClient.get<Transaction[]>('', { params });
    return response.data;
  },
  
  createTransaction: async (transaction: Omit<Transaction, 'id' | 'status'>) => {
    const response = await apiClient.post<Transaction>('', transaction);
    return response.data;
  },
  
  updateTransaction: async (id: number, transaction: Partial<Transaction>) => {
    const response = await apiClient.put<Transaction>(`/${id}`, transaction);
    return response.data;
  },
  
  deleteTransaction: async (id: number) => {
    await apiClient.delete(`/${id}`);
  },
  
  processPayment: async (amount: number) => {
    await apiClient.post('/process-payment', null, {
      params: { amount }
    });
  }
}; 