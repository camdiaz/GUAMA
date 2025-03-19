package com.guama.transacciones.service;

import com.guama.transacciones.model.Transaction;
import com.guama.transacciones.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @InjectMocks
    private TransactionService transactionService;

    private Transaction transaction1;
    private Transaction transaction2;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        transaction1 = new Transaction();
        transaction1.setId(1L);
        transaction1.setName("Test Transaction 1");
        transaction1.setDate(LocalDate.of(2024, 1, 1));
        transaction1.setAmount(new BigDecimal("100.00"));
        transaction1.setStatus(Transaction.TransactionStatus.PENDING);

        transaction2 = new Transaction();
        transaction2.setId(2L);
        transaction2.setName("Test Transaction 2");
        transaction2.setDate(LocalDate.of(2024, 1, 2));
        transaction2.setAmount(new BigDecimal("200.00"));
        transaction2.setStatus(Transaction.TransactionStatus.PENDING);
    }

    @Test
    void createTransactionShouldSetStatusToPending() {
        when(transactionRepository.save(any(Transaction.class))).thenReturn(transaction1);

        Transaction input = new Transaction();
        input.setName("Test Transaction");
        input.setDate(LocalDate.now());
        input.setAmount(new BigDecimal("100.00"));

        Transaction result = transactionService.createTransaction(input);

        assertEquals(Transaction.TransactionStatus.PENDING, input.getStatus());
        verify(transactionRepository).save(input);
    }

    @Test
    void updateTransactionShouldThrowExceptionForPaidTransactions() {
        transaction1.setStatus(Transaction.TransactionStatus.PAID);
        when(transactionRepository.findById(1L)).thenReturn(Optional.of(transaction1));

        assertThrows(IllegalStateException.class, () -> {
            transactionService.updateTransaction(1L, transaction1);
        });
    }

    @Test
    void deleteTransactionShouldThrowExceptionForPaidTransactions() {
        transaction1.setStatus(Transaction.TransactionStatus.PAID);
        when(transactionRepository.findById(1L)).thenReturn(Optional.of(transaction1));

        assertThrows(IllegalStateException.class, () -> {
            transactionService.deleteTransaction(1L);
        });
    }

    @Test
    void processPaymentShouldPayTransactionsInOrder() {
        List<Transaction> transactions = Arrays.asList(transaction1, transaction2);
        when(transactionRepository.findAll()).thenReturn(transactions);

        transactionService.processPayment(new BigDecimal("150.00"));

        // Solo la primera transacción debería ser pagada
        assertEquals(Transaction.TransactionStatus.PAID, transaction1.getStatus());
        assertEquals(Transaction.TransactionStatus.PENDING, transaction2.getStatus());
        
        verify(transactionRepository).save(transaction1);
        verify(transactionRepository, never()).save(transaction2);
    }

    @Test
    void processPaymentShouldPayAllTransactionsIfEnoughMoney() {
        List<Transaction> transactions = Arrays.asList(transaction1, transaction2);
        when(transactionRepository.findAll()).thenReturn(transactions);

        transactionService.processPayment(new BigDecimal("300.00"));

        // Ambas transacciones deberían ser pagadas
        assertEquals(Transaction.TransactionStatus.PAID, transaction1.getStatus());
        assertEquals(Transaction.TransactionStatus.PAID, transaction2.getStatus());
        
        verify(transactionRepository).save(transaction1);
        verify(transactionRepository).save(transaction2);
    }
} 