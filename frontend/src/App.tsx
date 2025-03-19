import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Layout } from './components/layout/Layout';
import { TransactionListSimple } from './components/transactions/TransactionListSimple';
import { useTransactions } from './hooks/useTransactions';
import { theme } from './theme/theme';
import { CircularProgress, Box } from '@mui/material';

function App() {
  const {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    processPayment
  } = useTransactions();

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Layout>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <CircularProgress />
          </Box>
        </Layout>
      </ThemeProvider>
    );
  }

  console.log("Transactions:", transactions); // Para depuración

  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <TransactionListSimple transactions={transactions} />
      </Layout>
    </ThemeProvider>
  );
}

export default App;
