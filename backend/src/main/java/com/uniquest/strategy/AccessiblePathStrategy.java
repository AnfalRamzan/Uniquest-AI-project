package com.uniquest.strategy;

import com.uniquest.model.Location;
import org.springframework.stereotype.Component;
import java.util.HashMap;
import java.util.Map;

@Component("accessiblePath")
public class AccessiblePathStrategy implements RouteStrategy {

    @Override
    public Map<String, Object> calculateRoute(Location start, Location end) {
        Map<String, Object> result = new HashMap<>();
        
        // Accessibility logic
        if (Boolean.FALSE.equals(end.getAccessible())) {
            result.put("error", "⚠️ Destination is not wheelchair accessible.");
            result.put("distanceKm", 0);
            result.put("timeMins", 0);
            result.put("instructions", "Cannot find an accessible route to this location.");
            return result;
        }

        // Distance calculation (slightly longer than shortest)
        double latDiff = start.getLatitude() - end.getLatitude();
        double lonDiff = start.getLongitude() - end.getLongitude();
        double distanceKm = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff) * 111.0 * 1.2; // 20% longer for ramps
        int timeMins = (int) ((distanceKm / 4.0) * 60); // Slower speed for wheelchair

        result.put("distanceKm", Math.round(distanceKm * 100.0) / 100.0);
        result.put("timeMins", timeMins);
        result.put("instructions", "Accessible route using ramps and elevators to " + end.getName());
        return result;
    }
}