package com.uniquest.service.impl;

import com.uniquest.model.RecentSearch;
import com.uniquest.model.User;
import com.uniquest.repository.RecentSearchRepository;
import com.uniquest.repository.UserRepository;
import com.uniquest.service.RecentSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecentSearchServiceImpl implements RecentSearchService {

    private static final int MAX_RECENT = 10;

    private final RecentSearchRepository recentSearchRepository;
    private final UserRepository userRepository;

    @Override
    public List<String> getRecent(String userEmail) {
        Long userId = getUserId(userEmail);
        return recentSearchRepository.findTop10ByUserIdOrderBySearchedAtDesc(userId)
                .stream()
                .map(RecentSearch::getQuery)
                .toList();
    }

    @Override
    @Transactional
    public void record(String userEmail, String query) {
        if (query == null || query.isBlank()) return;
        String q = query.trim();
        if (q.length() > 100) q = q.substring(0, 100);

        Long userId = getUserId(userEmail);

        // Pehle same query delete karo (taaki duplicate na rahe aur naya timestamp mile)
        recentSearchRepository.deleteByUserIdAndQuery(userId, q);

        // Save new entry
        recentSearchRepository.save(RecentSearch.builder()
                .userId(userId)
                .query(q)
                .build());

        // Keep only last MAX_RECENT
        List<RecentSearch> all = recentSearchRepository.findTop10ByUserIdOrderBySearchedAtDesc(userId);
        if (all.size() > MAX_RECENT) {
            // delete extras
            for (int i = MAX_RECENT; i < all.size(); i++) {
                recentSearchRepository.deleteById(all.get(i).getId());
            }
        }
    }

    @Override
    @Transactional
    public void clear(String userEmail) {
        Long userId = getUserId(userEmail);
        // delete all
        recentSearchRepository.findAll().stream()
                .filter(r -> r.getUserId().equals(userId))
                .forEach(recentSearchRepository::delete);
    }

    private Long getUserId(String email) {
        User u = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        return u.getId();
    }
}