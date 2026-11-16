package com.uniquest.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "locations")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String building;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LocationType type;

    @Column(nullable = false)
    private Integer floor;

    private String description;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    // ⚠️ FIX: MySQL 8.0 mein "accessible" reserved keyword hai
    // DB column ka naam "is_accessible" rakha, lekin Java/DTO mein "accessible" hi rahega
    @Column(name = "is_accessible")
    private Boolean accessible;
}