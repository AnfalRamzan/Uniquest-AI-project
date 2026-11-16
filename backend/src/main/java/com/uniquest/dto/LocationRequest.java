package com.uniquest.dto;

import com.uniquest.model.LocationType;
import lombok.Data;

@Data
public class LocationRequest {
    private String name;
    private String building;
    private LocationType type;
    private Integer floor;
    private String description;
    private Double latitude;
    private Double longitude;
    private Boolean accessible;
}