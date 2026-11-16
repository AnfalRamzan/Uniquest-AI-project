package com.uniquest.strategy;

import com.uniquest.model.Location;
import java.util.Map;

public interface RouteStrategy {
    Map<String, Object> calculateRoute(Location start, Location end);
}