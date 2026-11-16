package com.uniquest.controller;

import com.uniquest.service.RouteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
public class RouteController {

    private final RouteService routeService;

    @GetMapping
    public ResponseEntity<?> planRoute(
            @RequestParam Long startId,
            @RequestParam Long endId,
            @RequestParam(defaultValue = "shortestPath") String strategy) {
        try {
            return ResponseEntity.ok(routeService.getRoute(startId, endId, strategy));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}