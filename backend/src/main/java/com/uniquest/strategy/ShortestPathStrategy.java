package com.uniquest.strategy;

import com.uniquest.model.Location;
import org.springframework.stereotype.Component;
import java.util.HashMap;
import java.util.Map;

@Component("shortestPath")
public class ShortestPathStrategy implements RouteStrategy {

    @Override
    public Map<String, Object> calculateRoute(Location start, Location end) {
        // Simple Euclidean distance formula (approximation)
        double latDiff = start.getLatitude() - end.getLatitude();
        double lonDiff = start.getLongitude() - end.getLongitude();
        double distanceInDegrees = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
        
        // 1 degree is approx 111 km
        double distanceKm = distanceInDegrees * 111.0; 
        int timeMins = (int) ((distanceKm / 5.0) * 60); // Assuming walking speed 5km/h

        Map<String, Object> result = new HashMap<>();
        result.put("distanceKm", Math.round(distanceKm * 100.0) / 100.0);
        result.put("timeMins", timeMins);
        result.put("instructions", "Fastest route to " + end.getName() + " via main walkways.");
        return result;
    }
}