package com.uniquest.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "favorite")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "location_id", nullable = false)
    private Long locationId;

    @Column(name = "user_id", nullable = false)
    private Long userId;
}