package com.uniquest.service.impl;

import com.uniquest.dto.LocationRequest;
import com.uniquest.dto.LocationResponse;
import com.uniquest.model.Location;
import com.uniquest.model.LocationType;
import com.uniquest.pattern.factory.LocationFactory;
import com.uniquest.pattern.singleton.CampusCache;
import com.uniquest.repository.LocationRepository;
import com.uniquest.service.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LocationServiceImpl implements LocationService {

    private final LocationRepository locationRepository;
    private final LocationFactory locationFactory;
    private final CampusCache campusCache = CampusCache.getInstance(); // Singleton

    @Override
    public List<LocationResponse> getAll() {
        return locationRepository.findAll().stream()
                .map(LocationResponse::from).toList();
    }

    @Override
    public List<LocationResponse> search(String q, String building, LocationType type) {
        return locationRepository.search(emptyToNull(q), emptyToNull(building), type)
                .stream().map(LocationResponse::from).toList();
    }

    @Override
    public LocationResponse getById(Long id) {
        return LocationResponse.from(find(id));
    }

    @Override
    public LocationResponse create(LocationRequest req) {
        validate(req);
        Location loc = locationFactory.create(
                req.getType(), req.getName(), req.getBuilding(),
                req.getFloor(), req.getDescription(),
                req.getLatitude(), req.getLongitude());

        // agar accessible explicitly diya gaya ho toh override karo
        if (req.getAccessible() != null) loc.setAccessible(req.getAccessible());

        Location saved = locationRepository.save(loc);
        campusCache.put("loc:" + saved.getId(), saved.getName());
        return LocationResponse.from(saved);
    }

    @Override
    public LocationResponse update(Long id, LocationRequest req) {
        Location loc = find(id);
        loc.setName(req.getName());
        loc.setBuilding(req.getBuilding());
        loc.setType(req.getType());
        loc.setFloor(req.getFloor() != null ? req.getFloor() : loc.getFloor());
        loc.setDescription(req.getDescription());
        if (req.getLatitude() != null)  loc.setLatitude(req.getLatitude());
        if (req.getLongitude() != null) loc.setLongitude(req.getLongitude());
        if (req.getAccessible() != null) loc.setAccessible(req.getAccessible());

        return LocationResponse.from(locationRepository.save(loc));
    }

    @Override
    public void delete(Long id) {
        find(id);
        locationRepository.deleteById(id);
        campusCache.clear();
    }

    private Location find(Long id) {
        return locationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Location not found: " + id));
    }

    private void validate(LocationRequest req) {
        if (req.getName() == null || req.getName().isBlank())
            throw new RuntimeException("Name is required");
        if (req.getBuilding() == null || req.getBuilding().isBlank())
            throw new RuntimeException("Building is required");
        if (req.getType() == null)
            throw new RuntimeException("Type is required");
    }

    private String emptyToNull(String s) {
        return (s == null || s.isBlank()) ? null : s;
    }
}