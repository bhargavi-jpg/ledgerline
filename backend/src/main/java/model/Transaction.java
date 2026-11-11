package com.ledgerline.model;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String fromAccount;
    private String toAccount;
    @Column(nullable = false)
    private BigDecimal amount;
    private String type;
    private String status;
    private String description;
    private LocalDateTime timestamp = LocalDateTime.now();
    @PrePersist
    public void prePersist() { timestamp = LocalDateTime.now(); }
}