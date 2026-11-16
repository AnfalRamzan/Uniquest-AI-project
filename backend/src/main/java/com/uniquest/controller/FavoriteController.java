package com.uniquest.controller;

import com.uniquest.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @GetMapping
    public ResponseEntity<?> list(Authentication auth) {
        try {
            return ResponseEntity.ok(favoriteService.getFavorites(auth.getName()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{locationId}")
    public ResponseEntity<?> add(Authentication auth, @PathVariable Long locationId) {
        try {
            favoriteService.addFavorite(auth.getName(), locationId);
            return ResponseEntity.ok("Added to favorites");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{locationId}")
    public ResponseEntity<?> remove(Authentication auth, @PathVariable Long locationId) {
        try {
            favoriteService.removeFavorite(auth.getName(), locationId);
            return ResponseEntity.ok("Removed from favorites");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/check/{locationId}")
    public ResponseEntity<?> check(Authentication auth, @PathVariable Long locationId) {
        try {
            return ResponseEntity.ok(favoriteService.isFavorite(auth.getName(), locationId));
        } catch (Exception e) {
            return ResponseEntity.ok(false);
        }
    }
}