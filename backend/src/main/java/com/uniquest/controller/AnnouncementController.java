package com.uniquest.controller;

import com.uniquest.model.Announcement;
import com.uniquest.pattern.observer.AnnouncementSubject;
import com.uniquest.repository.AnnouncementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementRepository repository;
    private final AnnouncementSubject subject;

    @GetMapping
    public ResponseEntity<List<Announcement>> getAll(@RequestParam(required = false) String category) {
        if (category != null && !category.isEmpty()) {
            return ResponseEntity.ok(repository.findByCategoryOrderByCreatedAtDesc(category));
        }
        return ResponseEntity.ok(repository.findAllByOrderByCreatedAtDesc());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Announcement announcement) {
        try {
            Announcement saved = repository.save(announcement);
            // 🔥 OBSERVER PATTERN IN ACTION
            subject.notifyObservers(saved);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}