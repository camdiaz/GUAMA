import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Box,
  Chip,
  Tooltip,
  Typography,
  Alert,
  AlertTitle,
  Badge
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Payment as PaymentIcon,
  ErrorOutline as ErrorIcon
} from '@mui/icons-material';
import { Transaction, TransactionFilter } from '../../types/Transaction';
import { TransactionForm } from '../forms/TransactionForm';
import { PaymentForm } from '../forms/PaymentForm';
import { TransactionFilters } from './TransactionFilters';
import { TransactionSummary } from './TransactionSummary';

interface TransactionListProps {
  transactions: Transaction[];
  onAdd: (transaction: Omit<Transaction, 'id' | 'status'>) => Promise<void>;
  onUpdate: (id: number, transaction: Partial<Transaction>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onProcessPayment: (amount: number) => Promise<void>;
  error: string | null;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onAdd,
  onUpdate,
  onDelete,
  onProcessPayment,
  error
}) => {
  const [openAddForm, setOpenAddForm] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [openPaymentForm, setOpenPaymentForm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState<TransactionFilter>({});
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesName = !filters.name || 
      transaction.name.toLowerCase().includes((filters.name || '').toLowerCase());
    const matchesDate = !filters.date || transaction.date === filters.date;
    const matchesStatus = !filters.status || transaction.status === filters.status;
    return matchesName && matchesDate && matchesStatus;
  });

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setOpenEditForm(true);
  };

  const handleEditSubmit = async (transaction: Partial<Transaction>) => {
    if (selectedTransaction?.id) {
      setLoading(true);
      try {
        await onUpdate(selectedTransaction.id, transaction);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await onDelete(id);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (transaction: Omit<Transaction, 'id' | 'status'>) => {
    setLoading(true);
    try {
      await onAdd(transaction);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async (amount: number) => {
    setLoading(true);
    try {
      await onProcessPayment(amount);
    } finally {
      setLoading(false);
    }
  };

  const pendingTotal = transactions
    .filter(t => t.status === 'PENDING')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingCount = transactions.filter(t => t.status === 'PENDING').length;

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}
      
      <TransactionSummary transactions={transactions} />
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => setOpenAddForm(true)}
          disabled={loading}
          sx={{ px: 3, py: 1.2, borderRadius: 2 }}
        >
          Nueva Transacción
        </Button>
        
        <Button 
          variant="contained" 
          color="secondary"
          startIcon={<PaymentIcon />}
          onClick={() => setOpenPaymentForm(true)}
          disabled={pendingTotal <= 0 || loading}
          sx={{ px: 3, py: 1.2, borderRadius: 2 }}
        >
          <Badge badgeContent={pendingCount} color="error" sx={{ mr: 1 }}>
            Procesar Pago
          </Badge>
        </Button>
      </Box>
      
      <TransactionFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />
      
      <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Valor</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id} hover>
                  <TableCell>{transaction.name}</TableCell>
                  <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Typography fontWeight="medium">${transaction.amount.toFixed(2)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={transaction.status === 'PAID' ? 'Pagado' : 'Pendiente'} 
                      color={transaction.status === 'PAID' ? 'success' : 'warning'}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell>
                    {transaction.status !== 'PAID' ? (
                      <>
                        <Tooltip title="Editar">
                          <IconButton 
                            color="primary" 
                            onClick={() => handleEdit(transaction)}
                            disabled={loading}
                            size="small"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton 
                            color="error"
                            onClick={() => handleDelete(transaction.id!)}
                            disabled={loading}
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    ) : (
                      <Typography variant="caption" color="text.secondary">No disponible</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <ErrorIcon color="action" sx={{ fontSize: 40, opacity: 0.5 }} />
                    <Typography color="text.secondary">No hay transacciones disponibles</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TransactionForm
        open={openAddForm}
        onClose={() => setOpenAddForm(false)}
        onSubmit={handleAddTransaction}
      />
      
      <TransactionForm
        open={openEditForm}
        onClose={() => {
          setOpenEditForm(false);
          setSelectedTransaction(null);
        }}
        onSubmit={handleEditSubmit}
        transaction={selectedTransaction || undefined}
      />
      
      <PaymentForm
        open={openPaymentForm}
        onClose={() => setOpenPaymentForm(false)}
        onSubmit={handleProcessPayment}
        pendingTotal={pendingTotal}
      />
    </>
  );
}; 