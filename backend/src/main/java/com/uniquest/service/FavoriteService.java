package com.uniquest.service;

import com.uniquest.dto.LocationResponse;

import java.util.List;

public interface FavoriteService {
    List<LocationResponse> getFavorites(String userEmail);
    void addFavorite(String userEmail, Long locationId);
    void removeFavorite(String userEmail, Long locationId);
    boolean isFavorite(String userEmail, Long locationId);
}