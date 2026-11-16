package com.uniquest.pattern.observer;

import com.uniquest.model.Announcement;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class LoggingObserver implements AnnouncementObserver {
    private static final Logger log = LoggerFactory.getLogger(LoggingObserver.class);

    @Override
    public void onAnnouncementCreated(Announcement a) {
        log.info("📢 NEW ANNOUNCEMENT NOTIFIED: [{}] {}", a.getCategory(), a.getTitle());
    }
}