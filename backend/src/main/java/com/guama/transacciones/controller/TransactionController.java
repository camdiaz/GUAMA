package com.guama.transacciones.controller;

import com.guama.transacciones.model.Transaction;
import com.guama.transacciones.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/transactions")
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping
    public List<Transaction> getAllTransactions(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) LocalDate date,
            @RequestParam(required = false) Transaction.TransactionStatus status) {
        return transactionService.findTransactions(name, date, status);
    }

    @PostMapping
    public ResponseEntity<Transaction> createTransaction(@Valid @RequestBody Transaction transaction) {
        Transaction created = transactionService.createTransaction(transaction);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(
            @PathVariable Long id,
            @Valid @RequestBody Transaction transaction) {
        Transaction updated = transactionService.updateTransaction(id, transaction);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/process-payment")
    public ResponseEntity<Void> processPayment(@RequestParam BigDecimal amount) {
        transactionService.processPayment(amount);
        return ResponseEntity.ok().build();
    }
} 