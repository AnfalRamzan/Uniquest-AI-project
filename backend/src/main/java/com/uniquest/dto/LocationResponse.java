package com.uniquest.dto;

import com.uniquest.model.Location;
import com.uniquest.model.LocationType;
import lombok.Data;

@Data
public class LocationResponse {
    private Long id;
    private String name;
    private String building;
    private LocationType type;
    private Integer floor;
    private String description;
    private Double latitude;
    private Double longitude;
    private Boolean accessible;

    public static LocationResponse from(Location l) {
        LocationResponse r = new LocationResponse();
        r.setId(l.getId());
        r.setName(l.getName());
        r.setBuilding(l.getBuilding());
        r.setType(l.getType());
        r.setFloor(l.getFloor());
        r.setDescription(l.getDescription());
        r.setLatitude(l.getLatitude());
        r.setLongitude(l.getLongitude());
        r.setAccessible(l.getAccessible());
        return r;
    }
}