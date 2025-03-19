import { useState, useEffect, useCallback } from 'react';
import { Transaction, TransactionFilter } from '../types/Transaction';
import { api } from '../services/api';

// Datos de ejemplo para empezar sin backend
const dummyTransactions: Transaction[] = [
  { id: 1, name: 'Factura Electricidad', date: '2024-05-01', amount: 150, status: 'PENDING' },
  { id: 2, name: 'Compra Supermercado', date: '2024-05-02', amount: 75.50, status: 'PAID' },
  { id: 3, name: 'Suscripción Internet', date: '2024-05-05', amount: 45, status: 'PENDING' }
];

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<TransactionFilter>({});

  const fetchTransactions = useCallback(async (filters?: TransactionFilter) => {
    try {
      setLoading(true);
      const data = await api.getAllTransactions(filters);
      setTransactions(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Error al cargar las transacciones. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, []);

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'status'>) => {
    try {
      await api.createTransaction(transaction);
      await fetchTransactions(activeFilters);
      return true;
    } catch (err) {
      console.error('Error adding transaction:', err);
      setError('Error al crear la transacción. Por favor, intenta de nuevo.');
      return false;
    }
  };

  const updateTransaction = async (id: number, transaction: Partial<Transaction>) => {
    try {
      await api.updateTransaction(id, transaction);
      await fetchTransactions(activeFilters);
      return true;
    } catch (err) {
      console.error('Error updating transaction:', err);
      setError('Error al actualizar la transacción. Por favor, intenta de nuevo.');
      return false;
    }
  };

  const deleteTransaction = async (id: number) => {
    try {
      await api.deleteTransaction(id);
      await fetchTransactions(activeFilters);
      return true;
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError('Error al eliminar la transacción. Por favor, intenta de nuevo.');
      return false;
    }
  };

  const processPayment = async (amount: number) => {
    try {
      await api.processPayment(amount);
      await fetchTransactions(activeFilters);
      return true;
    } catch (err) {
      console.error('Error processing payment:', err);
      setError('Error al procesar el pago. Por favor, intenta de nuevo.');
      return false;
    }
  };

  const setFilters = (filters: TransactionFilter) => {
    setActiveFilters(filters);
    fetchTransactions(filters);
  };

  // Cargar transacciones al montar el componente
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    processPayment,
    setFilters
  };
}; 