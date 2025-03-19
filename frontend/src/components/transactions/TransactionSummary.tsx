import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { Transaction } from '../../types/Transaction';

interface TransactionSummaryProps {
  transactions: Transaction[];
}

export const TransactionSummary: React.FC<TransactionSummaryProps> = ({ transactions }) => {
  const pendingTotal = transactions
    .filter(t => t.status === 'PENDING')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const paidTotal = transactions
    .filter(t => t.status === 'PAID')
    .reduce((sum, t) => sum + t.amount, 0);
    
  return (
    <Paper sx={{ p: 3, mb: 3, display: 'flex', gap: 4 }}>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          Total Pendiente
        </Typography>
        <Typography variant="h6" color="primary" fontWeight="bold">
          ${pendingTotal.toFixed(2)}
        </Typography>
      </Box>
      
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          Total Pagado
        </Typography>
        <Typography variant="h6" color="success.main" fontWeight="bold">
          ${paidTotal.toFixed(2)}
        </Typography>
      </Box>
      
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          Total General
        </Typography>
        <Typography variant="h6" color="secondary.main" fontWeight="bold">
          ${(pendingTotal + paidTotal).toFixed(2)}
        </Typography>
      </Box>
    </Paper>
  );
}; 