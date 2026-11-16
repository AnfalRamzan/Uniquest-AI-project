package com.uniquest.strategy;

import com.uniquest.model.Location;

public interface RoutingStrategy {
    String calculate(Location start, Location end);
}