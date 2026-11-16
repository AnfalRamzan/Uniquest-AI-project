package com.uniquest.pattern.singleton;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class CampusCache {

    private static final CampusCache INSTANCE = new CampusCache();

    private final Map<String, String> cache = new ConcurrentHashMap<>();

    private CampusCache() {
    }

    public static CampusCache getInstance() {
        return INSTANCE;
    }

    public void put(String key, String value) {
        cache.put(key, value);
    }

    public String get(String key) {
        return cache.get(key);
    }

    public void clear() {
        cache.clear();
    }
}