package com.uniquest.pattern.observer;

import com.uniquest.model.Announcement;

public interface AnnouncementObserver {
    void onAnnouncementCreated(Announcement announcement);
}