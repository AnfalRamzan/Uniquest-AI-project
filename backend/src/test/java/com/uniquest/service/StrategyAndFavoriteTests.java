package com.uniquest.service;

import com.uniquest.model.Favorite;
import com.uniquest.model.Location;
import com.uniquest.model.User;
import com.uniquest.repository.FavoriteRepository;
import com.uniquest.repository.LocationRepository;
import com.uniquest.repository.UserRepository;
import com.uniquest.service.impl.FavoriteServiceImpl;
import com.uniquest.strategy.AccessiblePathStrategy;
import com.uniquest.strategy.ShortestPathStrategy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class StrategyAndFavoriteTests {

    @Mock private FavoriteRepository favoriteRepository;
    @Mock private LocationRepository locationRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks private FavoriteServiceImpl favoriteService;

    private ShortestPathStrategy shortestPath;
    private AccessiblePathStrategy accessiblePath;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        shortestPath = new ShortestPathStrategy();
        accessiblePath = new AccessiblePathStrategy();
    }

    @Test
    void testAddFavorite_Success() {
        User user = User.builder().id(1L).email("test@x.com").build();
        when(userRepository.findByEmail("test@x.com")).thenReturn(Optional.of(user));
        when(locationRepository.existsById(10L)).thenReturn(true);
        when(favoriteRepository.existsByUserIdAndLocationId(1L, 10L)).thenReturn(false);
        favoriteService.addFavorite("test@x.com", 10L);
        verify(favoriteRepository, times(1)).save(any(Favorite.class));
    }

    @Test
    void testAddFavorite_LocationNotFound_ThrowsException() {
        User user = User.builder().id(1L).email("test@x.com").build();
        when(userRepository.findByEmail("test@x.com")).thenReturn(Optional.of(user));
        when(locationRepository.existsById(99L)).thenReturn(false);
        assertThrows(RuntimeException.class, () -> favoriteService.addFavorite("test@x.com", 99L));
    }

    @Test
    void testShortestPathStrategy() {
        Location start = Location.builder().name("A").latitude(33.0).longitude(73.0).build();
        Location end = Location.builder().name("B").latitude(33.01).longitude(73.01).build();
        Map<String, Object> result = shortestPath.calculateRoute(start, end);
        assertTrue((Double) result.get("distanceKm") > 0);
        assertNull(result.get("error"));
    }

    @Test
    void testAccessiblePathStrategy_NotAccessible() {
        Location start = Location.builder().name("A").build();
        Location end = Location.builder().name("B").accessible(false).build();
        Map<String, Object> result = accessiblePath.calculateRoute(start, end);
        assertNotNull(result.get("error"));
        assertEquals(0, result.get("distanceKm"));
    }
}