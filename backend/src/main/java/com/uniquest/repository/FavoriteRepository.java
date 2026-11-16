package com.uniquest.repository;

import com.uniquest.model.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    List<Favorite> findByUserIdOrderByIdDesc(Long userId);

    Optional<Favorite> findByUserIdAndLocationId(Long userId, Long locationId);

    boolean existsByUserIdAndLocationId(Long userId, Long locationId);

    void deleteByUserIdAndLocationId(Long userId, Long locationId);
}