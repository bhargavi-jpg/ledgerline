package com.ledgerline.service;

import com.ledgerline.model.Account;
import com.ledgerline.model.Transaction;
import com.ledgerline.repository.AccountRepository;
import com.ledgerline.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.UUID;

@Service
public class LedgerService {

    private final AccountRepository accountRepo;
    private final TransactionRepository txnRepo;

    public LedgerService(AccountRepository accountRepo, TransactionRepository txnRepo) {
        this.accountRepo = accountRepo;
        this.txnRepo = txnRepo;
    }

    public Account createAccount(String ownerName, String type, BigDecimal initialBalance) {
        Account acc = Account.builder()
                .accountNumber("LL" + UUID.randomUUID().toString().substring(0,8).toUpperCase())
                .ownerName(ownerName)
                .accountType(type)
                .balance(initialBalance)
                .build();
        return accountRepo.save(acc);
    }

    @Transactional
    public Transaction credit(String accNumber, BigDecimal amount) {
        Account acc = accountRepo.findByAccountNumber(accNumber).orElseThrow(() -> new RuntimeException("Account not found"));
        acc.setBalance(acc.getBalance().add(amount));
        accountRepo.save(acc);
        Transaction txn = Transaction.builder()
                .toAccount(accNumber)
                .amount(amount)
                .type("CREDIT")
                .status("SUCCESS")
                .description("Credit " + amount)
                .build();
        return txnRepo.save(txn);
    }

    @Transactional
    public Transaction debit(String accNumber, BigDecimal amount) {
        Account acc = accountRepo.findByAccountNumber(accNumber).orElseThrow(() -> new RuntimeException("Account not found"));
        if (acc.getBalance().compareTo(amount) < 0) throw new RuntimeException("Insufficient funds");
        acc.setBalance(acc.getBalance().subtract(amount));
        accountRepo.save(acc);
        Transaction txn = Transaction.builder()
                .fromAccount(accNumber)
                .amount(amount)
                .type("DEBIT")
                .status("SUCCESS")
                .description("Debit " + amount)
                .build();
        return txnRepo.save(txn);
    }

    @Transactional
    public Transaction transfer(String from, String to, BigDecimal amount) {
        debit(from, amount);
        credit(to, amount);
        Transaction txn = Transaction.builder()
                .fromAccount(from)
                .toAccount(to)
                .amount(amount)
                .type("TRANSFER")
                .status("SUCCESS")
                .description("Transfer " + amount + " from " + from + " to " + to)
                .build();
        return txnRepo.save(txn);
    }
}