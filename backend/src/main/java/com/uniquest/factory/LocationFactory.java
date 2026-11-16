package com.uniquest.pattern.factory;

import com.uniquest.model.Location;
import com.uniquest.model.LocationType;
import org.springframework.stereotype.Component;

/**
 * FACTORY PATTERN
 * Har location type ke liye sensible defaults banata hai
 * (jaise lab ka accessible true, parking ka false).
 */
@Component
public class LocationFactory {

    public Location create(LocationType type, String name, String building,
                           Integer floor, String description,
                           Double lat, Double lng) {

        Location loc = Location.builder()
                .type(type)
                .name(name)
                .building(building)
                .floor(floor != null ? floor : 0)
                .description(description != null ? description : defaultDescription(type))
                .latitude(lat != null ? lat : 33.6844)
                .longitude(lng != null ? lng : 73.0479)
                .accessible(defaultAccessible(type))
                .build();

        return loc;
    }

    private String defaultDescription(LocationType t) {
        return switch (t) {
            case CLASSROOM -> "Standard classroom";
            case LAB       -> "Laboratory";
            case LIBRARY   -> "Library / study area";
            case OFFICE    -> "Administrative office";
            case CAFETERIA -> "Cafeteria / food court";
            case PARKING   -> "Vehicle parking area";
            case HOSTEL    -> "Residential hostel";
            default        -> "Campus facility";
        };
    }

    private Boolean defaultAccessible(LocationType t) {
        return switch (t) {
            case LIBRARY, CAFETERIA, OFFICE -> true;
            default -> false;
        };
    }
}