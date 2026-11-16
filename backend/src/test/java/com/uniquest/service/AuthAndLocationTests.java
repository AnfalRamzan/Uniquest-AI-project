package com.uniquest.service;

import com.uniquest.dto.LocationRequest;
import com.uniquest.dto.LocationResponse;
import com.uniquest.model.Location;
import com.uniquest.model.LocationType;
import com.uniquest.model.Role;
import com.uniquest.model.User;
import com.uniquest.pattern.factory.LocationFactory;
import com.uniquest.repository.LocationRepository;
import com.uniquest.repository.UserRepository;
import com.uniquest.security.JwtService;
import com.uniquest.service.impl.LocationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

public class AuthAndLocationTests {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;
    
    @Mock private LocationRepository locationRepository;
    @Mock private LocationFactory locationFactory;

    @InjectMocks private AuthService authService;
    @InjectMocks private LocationServiceImpl locationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegisterUser_Success() {
        User user = User.builder().name("Test").email("test@x.com").password("123").role(Role.STUDENT).build();
        when(userRepository.existsByEmail("test@x.com")).thenReturn(false);
        when(passwordEncoder.encode("123")).thenReturn("encoded123");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(jwtService.generateToken(anyString(), anyString())).thenReturn("dummy-jwt-token");

        var response = authService.register(user);
        assertEquals("dummy-jwt-token", response.getToken());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegisterUser_EmailExists_ThrowsException() {
        User user = User.builder().email("test@x.com").build();
        when(userRepository.existsByEmail("test@x.com")).thenReturn(true);
        Exception exception = assertThrows(RuntimeException.class, () -> authService.register(user));
        assertEquals("Email already registered", exception.getMessage());
    }

    @Test
    void testLogin_Success() {
        User user = User.builder().email("test@x.com").password("encoded123").role(Role.ADMIN).build();
        when(userRepository.findByEmail("test@x.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("123", "encoded123")).thenReturn(true);
        when(jwtService.generateToken("test@x.com", "ADMIN")).thenReturn("dummy-jwt-token");
        var response = authService.login("test@x.com", "123");
        assertEquals("dummy-jwt-token", response.getToken());
    }

    @Test
    void testLogin_WrongPassword_ThrowsException() {
        User user = User.builder().email("test@x.com").password("encoded123").build();
        when(userRepository.findByEmail("test@x.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "encoded123")).thenReturn(false);
        assertThrows(RuntimeException.class, () -> authService.login("test@x.com", "wrong"));
    }

    @Test
    void testGetLocationById_Success() {
        Location loc = Location.builder().id(1L).name("Library").build();
        when(locationRepository.findById(1L)).thenReturn(Optional.of(loc));
        LocationResponse response = locationService.getById(1L);
        assertEquals("Library", response.getName());
    }

    @Test
    void testGetLocationById_NotFound_ThrowsException() {
        when(locationRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> locationService.getById(99L));
    }

    // 👇 YEH METHOD UPDATE KIYA GAYA HAI 👇
    @Test
    void testCreateLocation_Success() {
        LocationRequest req = new LocationRequest();
        req.setName("Lab A"); 
        req.setType(LocationType.LAB); 
        req.setBuilding("Block A"); 
        req.setFloor(1);
        
        // ID (1L) add ki gayi hai taake response complete ho
        Location loc = Location.builder()
                .id(1L)
                .name("Lab A")
                .type(LocationType.LAB)
                .build();
        
        // anyInt() ki jagah any() use kiya hai kyunki Factory mein Integer mang raha hai
        when(locationFactory.create(any(), anyString(), anyString(), any(), any(), any(), any())).thenReturn(loc);
        when(locationRepository.save(any(Location.class))).thenReturn(loc);

        LocationResponse response = locationService.create(req);
        assertEquals("Lab A", response.getName());
    }

    @Test
    void testDeleteLocation_Success() {
        Location loc = Location.builder().id(1L).build();
        when(locationRepository.findById(1L)).thenReturn(Optional.of(loc));
        locationService.delete(1L);
        verify(locationRepository, times(1)).deleteById(1L);
    }
}