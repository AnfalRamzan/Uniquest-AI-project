package com.uniquest.service.impl;

import com.uniquest.dto.LocationResponse;
import com.uniquest.model.Favorite;
import com.uniquest.model.User;
import com.uniquest.repository.FavoriteRepository;
import com.uniquest.repository.LocationRepository;
import com.uniquest.repository.UserRepository;
import com.uniquest.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final LocationRepository locationRepository;
    private final UserRepository userRepository;

    @Override
    public List<LocationResponse> getFavorites(String userEmail) {
        Long userId = getUserId(userEmail);
        List<Favorite> favs = favoriteRepository.findByUserIdOrderByIdDesc(userId);

        List<LocationResponse> result = new ArrayList<>();
        for (Favorite f : favs) {
            locationRepository.findById(f.getLocationId())
                    .ifPresent(loc -> result.add(LocationResponse.from(loc)));
        }
        return result;
    }

    @Override
    public void addFavorite(String userEmail, Long locationId) {
        Long userId = getUserId(userEmail);

        // check location exists
        if (!locationRepository.existsById(locationId)) {
            throw new RuntimeException("Location not found: " + locationId);
        }

        // already exists? no-op
        if (favoriteRepository.existsByUserIdAndLocationId(userId, locationId)) {
            return;
        }

        favoriteRepository.save(Favorite.builder()
                .userId(userId)
                .locationId(locationId)
                .build());
    }

    @Override
    public void removeFavorite(String userEmail, Long locationId) {
        Long userId = getUserId(userEmail);
        favoriteRepository.deleteByUserIdAndLocationId(userId, locationId);
    }

    @Override
    public boolean isFavorite(String userEmail, Long locationId) {
        Long userId = getUserId(userEmail);
        return favoriteRepository.existsByUserIdAndLocationId(userId, locationId);
    }

    private Long getUserId(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        return user.getId();
    }
}