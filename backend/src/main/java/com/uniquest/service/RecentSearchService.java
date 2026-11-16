package com.uniquest.service;

import java.util.List;

public interface RecentSearchService {
    List<String> getRecent(String userEmail);
    void record(String userEmail, String query);
    void clear(String userEmail);
}