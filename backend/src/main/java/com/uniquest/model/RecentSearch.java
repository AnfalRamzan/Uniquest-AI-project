package com.uniquest.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "recent_searches")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class RecentSearch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String query;

    @Column(nullable = false)
    private LocalDateTime searchedAt;

    @PrePersist
    void onCreate() { this.searchedAt = LocalDateTime.now(); }
}