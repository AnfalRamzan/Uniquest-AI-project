package com.uniquest.repository;

import com.uniquest.model.RecentSearch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RecentSearchRepository extends JpaRepository<RecentSearch, Long> {

    List<RecentSearch> findTop10ByUserIdOrderBySearchedAtDesc(Long userId);

    Optional<RecentSearch> findByUserIdAndQuery(Long userId, String query);

    void deleteByUserIdAndQuery(Long userId, String query);
}