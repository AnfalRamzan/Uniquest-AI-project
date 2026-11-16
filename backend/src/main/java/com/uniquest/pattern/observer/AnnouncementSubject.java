package com.uniquest.pattern.observer;

import com.uniquest.model.Announcement;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;

@Component
public class AnnouncementSubject {
    private final List<AnnouncementObserver> observers = new ArrayList<>();

    public void attach(AnnouncementObserver observer) {
        observers.add(observer);
    }

    public void notifyObservers(Announcement announcement) {
        for (AnnouncementObserver obs : observers) {
            obs.onAnnouncementCreated(announcement);
        }
    }
}