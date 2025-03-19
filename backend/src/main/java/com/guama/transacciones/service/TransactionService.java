package com.guama.transacciones.service;

import com.guama.transacciones.model.Transaction;
import com.guama.transacciones.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    public List<Transaction> findTransactions(String name, LocalDate date, Transaction.TransactionStatus status) {
        List<Transaction> transactions = transactionRepository.findAll();
        
        return transactions.stream()
            .filter(t -> name == null || t.getName().toLowerCase().contains(name.toLowerCase()))
            .filter(t -> date == null || t.getDate().equals(date))
            .filter(t -> status == null || t.getStatus().equals(status))
            .collect(Collectors.toList());
    }

    public Transaction createTransaction(Transaction transaction) {
        transaction.setStatus(Transaction.TransactionStatus.PENDING);
        return transactionRepository.save(transaction);
    }

    @Transactional
    public Transaction updateTransaction(Long id, Transaction transaction) {
        return transactionRepository.findById(id)
            .map(existingTransaction -> {
                if (existingTransaction.getStatus() == Transaction.TransactionStatus.PAID) {
                    throw new IllegalStateException("No se puede editar una transacción pagada");
                }
                existingTransaction.setName(transaction.getName());
                existingTransaction.setDate(transaction.getDate());
                existingTransaction.setAmount(transaction.getAmount());
                return transactionRepository.save(existingTransaction);
            })
            .orElseThrow(() -> new RuntimeException("Transacción no encontrada"));
    }

    @Transactional
    public void deleteTransaction(Long id) {
        Transaction transaction = transactionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Transacción no encontrada"));
            
        if (transaction.getStatus() == Transaction.TransactionStatus.PAID) {
            throw new IllegalStateException("No se puede eliminar una transacción pagada");
        }
        
        transactionRepository.delete(transaction);
    }

    @Transactional
    public void processPayment(BigDecimal amount) {
        // Obtener todas las transacciones pendientes ordenadas por fecha
        List<Transaction> pendingTransactions = transactionRepository.findAll().stream()
            .filter(t -> t.getStatus() == Transaction.TransactionStatus.PENDING)
            .sorted((t1, t2) -> t1.getDate().compareTo(t2.getDate()))
            .collect(Collectors.toList());
        
        BigDecimal remainingAmount = amount;
        
        for (Transaction transaction : pendingTransactions) {
            // Si el monto restante es suficiente para pagar la transacción completa
            if (remainingAmount.compareTo(transaction.getAmount()) >= 0) {
                transaction.setStatus(Transaction.TransactionStatus.PAID);
                transactionRepository.save(transaction);
                remainingAmount = remainingAmount.subtract(transaction.getAmount());
            } else {
                // Si no hay suficiente para pagar esta transacción, terminamos
                break;
            }
        }
    }
} 