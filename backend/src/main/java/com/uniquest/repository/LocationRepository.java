package com.uniquest.repository;

import com.uniquest.model.Location;
import com.uniquest.model.LocationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LocationRepository extends JpaRepository<Location, Long> {

    List<Location> findByNameContainingIgnoreCase(String q);

    List<Location> findByBuildingContainingIgnoreCase(String building);

    List<Location> findByType(LocationType type);

    // Multi-filter search (Module 4 Strategy use karega)
    @Query("""
        SELECT l FROM Location l
        WHERE (:q IS NULL OR LOWER(l.name) LIKE LOWER(CONCAT('%', :q, '%')))
          AND (:building IS NULL OR LOWER(l.building) LIKE LOWER(CONCAT('%', :building, '%')))
          AND (:type IS NULL OR l.type = :type)
        ORDER BY l.name
    """)
    List<Location> search(@Param("q") String q,
                          @Param("building") String building,
                          @Param("type") LocationType type);
}