package com.uniquest.service;

import com.uniquest.dto.LocationRequest;
import com.uniquest.dto.LocationResponse;
import com.uniquest.model.LocationType;

import java.util.List;

public interface LocationService {
    List<LocationResponse> getAll();
    List<LocationResponse> search(String q, String building, LocationType type);
    LocationResponse getById(Long id);
    LocationResponse create(LocationRequest req);
    LocationResponse update(Long id, LocationRequest req);
    void delete(Long id);
}