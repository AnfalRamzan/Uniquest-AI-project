package com.uniquest.config;

import org.springframework.stereotype.Component;

@Component
public class CampusConfig {
    private static CampusConfig instance;
    private String campusName = "My University";

    private CampusConfig() {}

    public static synchronized CampusConfig getInstance() {
        if (instance == null) instance = new CampusConfig();
        return instance;
    }

    public String getCampusName() { return campusName; }
    public void setCampusName(String n) { this.campusName = n; }
}