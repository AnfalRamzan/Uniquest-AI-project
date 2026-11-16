package com.uniquest.controller;

import com.uniquest.service.RecentSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/recent-searches")
@RequiredArgsConstructor
public class RecentSearchController {

    private final RecentSearchService service;

    @GetMapping
    public ResponseEntity<?> list(Authentication auth) {
        try {
            return ResponseEntity.ok(service.getRecent(auth.getName()));
        } catch (Exception e) {
            return ResponseEntity.ok(java.util.List.of());
        }
    }

    @PostMapping
    public ResponseEntity<?> record(Authentication auth, @RequestBody Map<String, String> body) {
        try {
            service.record(auth.getName(), body.get("query"));
            return ResponseEntity.ok("Recorded");
        } catch (Exception e) {
            return ResponseEntity.ok("Ignored");
        }
    }

    @DeleteMapping
    public ResponseEntity<?> clear(Authentication auth) {
        try {
            service.clear(auth.getName());
            return ResponseEntity.ok("Cleared");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}