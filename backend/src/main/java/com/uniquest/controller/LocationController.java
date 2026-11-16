package com.uniquest.controller;

import com.uniquest.dto.LocationRequest;
import com.uniquest.dto.LocationResponse;
import com.uniquest.model.LocationType;
import com.uniquest.service.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class LocationController {

    private final LocationService locationService;

    // READ — saare locations
    @GetMapping
    public ResponseEntity<?> list(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String building,
            @RequestParam(required = false) LocationType type) {
        try {
            if (q != null || building != null || type != null) {
                return ResponseEntity.ok(locationService.search(q, building, type));
            }
            return ResponseEntity.ok(locationService.getAll());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // READ — ek location
    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(locationService.getById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // CREATE — admin only (SecurityConfig se handle)
    @PostMapping
    public ResponseEntity<?> create(@RequestBody LocationRequest req) {
        try {
            return ResponseEntity.ok(locationService.create(req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // UPDATE — admin only
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody LocationRequest req) {
        try {
            return ResponseEntity.ok(locationService.update(id, req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE — admin only
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            locationService.delete(id);
            return ResponseEntity.ok("Deleted");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}