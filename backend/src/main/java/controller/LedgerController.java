package com.ledgerline.controller;

import com.ledgerline.model.Account;
import com.ledgerline.model.Transaction;
import com.ledgerline.repository.AccountRepository;
import com.ledgerline.repository.TransactionRepository;
import com.ledgerline.service.LedgerService;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ledger")
@CrossOrigin(origins = "*")
public class LedgerController {

    private final LedgerService ledgerService;
    private final AccountRepository accountRepo;
    private final TransactionRepository txnRepo;

    public LedgerController(LedgerService ledgerService, AccountRepository accountRepo, TransactionRepository txnRepo) {
        this.ledgerService = ledgerService;
        this.accountRepo = accountRepo;
        this.txnRepo = txnRepo;
    }

    @PostMapping("/accounts")
    public Account createAccount(@RequestBody Map<String, String> body) {
        String ownerName = body.get("ownerName");
        String type = body.getOrDefault("accountType", "SAVINGS");
        BigDecimal balance = new BigDecimal(body.getOrDefault("initialBalance", "0"));
        return ledgerService.createAccount(ownerName, type, balance);
    }

    @GetMapping("/accounts")
    public List<Account> getAllAccounts() {
        return accountRepo.findAll();
    }

    @PostMapping("/credit")
    public Transaction credit(@RequestBody Map<String, String> body) {
        return ledgerService.credit(body.get("accountNumber"), new BigDecimal(body.get("amount")));
    }

    @PostMapping("/debit")
    public Transaction debit(@RequestBody Map<String, String> body) {
        return ledgerService.debit(body.get("accountNumber"), new BigDecimal(body.get("amount")));
    }

    @PostMapping("/transfer")
    public Transaction transfer(@RequestBody Map<String, String> body) {
        return ledgerService.transfer(body.get("fromAccount"), body.get("toAccount"), new BigDecimal(body.get("amount")));
    }

    @GetMapping("/transactions")
    public List<Transaction> getAllTransactions() {
        return txnRepo.findAll();
    }
}