package com.uniquest.service;

import com.uniquest.model.Location;
import com.uniquest.repository.LocationRepository;
import com.uniquest.strategy.RouteStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RouteService {

    private final LocationRepository locationRepository;
    private final Map<String, RouteStrategy> strategies; // Spring injects all strategies

    public Map<String, Object> getRoute(Long startId, Long endId, String strategyName) {
        Location start = locationRepository.findById(startId).orElseThrow();
        Location end = locationRepository.findById(endId).orElseThrow();
        
        // STRATEGY PATTERN: Select strategy dynamically based on user request
        RouteStrategy strategy = strategies.get(strategyName);
        if (strategy == null) {
            strategy = strategies.get("shortestPath"); // Default
        }
        
        return strategy.calculateRoute(start, end);
    }
}