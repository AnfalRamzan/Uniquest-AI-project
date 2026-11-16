package com.uniquest.config;

import com.uniquest.model.Location;
import com.uniquest.model.LocationType;
import com.uniquest.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final LocationRepository locationRepository;

    @Override
    public void run(String... args) {
        if (locationRepository.count() > 0) return;

        // 🏛️ QUAID-E-AZAM UNIVERSITY, ISLAMABAD
        // Campus center approx: 33.7463° N, 73.1380° E
        locationRepository.saveAll(List.of(
            Location.builder().name("Central Library").building("Main Campus")
                .type(LocationType.LIBRARY).floor(1).accessible(true)
                .description("Main university library with study halls and digital resources")
                .latitude(33.7464).longitude(73.1382).build(),

            Location.builder().name("Computer Science Department").building("Academic Block A")
                .type(LocationType.OFFICE).floor(2).accessible(true)
                .description("CS Department - faculty offices and labs")
                .latitude(33.7459).longitude(73.1376).build(),

            Location.builder().name("CS Lab 1").building("Academic Block A")
                .type(LocationType.LAB).floor(2).accessible(false)
                .description("Computer lab with 40 workstations")
                .latitude(33.7459).longitude(73.1377).build(),

            Location.builder().name("Administration Block").building("Main Campus")
                .type(LocationType.OFFICE).floor(1).accessible(true)
                .description("Vice Chancellor office, admissions, registrar")
                .latitude(33.7471).longitude(73.1376).build(),

            Location.builder().name("Physics Department").building("Science Block")
                .type(LocationType.OFFICE).floor(1).accessible(true)
                .description("Physics department - lecture halls and labs")
                .latitude(33.7468).longitude(73.1379).build(),

            Location.builder().name("Chemistry Department").building("Science Block")
                .type(LocationType.OFFICE).floor(2).accessible(false)
                .description("Chemistry department with research labs")
                .latitude(33.7462).longitude(73.1385).build(),

            Location.builder().name("Mathematics Department").building("Academic Block B")
                .type(LocationType.OFFICE).floor(2).accessible(true)
                .description("Mathematics department and seminar hall")
                .latitude(33.7464).longitude(73.1378).build(),

            Location.builder().name("Main Cafeteria").building("Student Center")
                .type(LocationType.CAFETERIA).floor(0).accessible(true)
                .description("Central cafeteria serving breakfast, lunch, and snacks")
                .latitude(33.7456).longitude(73.1388).build(),

            Location.builder().name("Boys Hostel").building("Hostel Block")
                .type(LocationType.HOSTEL).floor(0).accessible(false)
                .description("Male student residential facility")
                .latitude(33.7447).longitude(73.1392).build(),

            Location.builder().name("Girls Hostel").building("Hostel Block")
                .type(LocationType.HOSTEL).floor(0).accessible(false)
                .description("Female student residential facility")
                .latitude(33.7453).longitude(73.1400).build(),

            Location.builder().name("Sports Complex").building("Main Campus")
                .type(LocationType.OTHER).floor(0).accessible(true)
                .description("Indoor and outdoor sports facilities, gym")
                .latitude(33.7449).longitude(73.1378).build(),

            Location.builder().name("Medical Center").building("Health Block")
                .type(LocationType.OTHER).floor(1).accessible(true)
                .description("Campus medical center - first aid, doctor on duty")
                .latitude(33.7466).longitude(73.1370).build(),

            Location.builder().name("New Academic Block").building("Academic Block C")
                .type(LocationType.CLASSROOM).floor(1).accessible(true)
                .description("Modern classrooms with smart boards")
                .latitude(33.7469).longitude(73.1397).build(),

            Location.builder().name("Main Parking").building("Main Campus")
                .type(LocationType.PARKING).floor(0).accessible(true)
                .description("Central parking area for staff and visitors")
                .latitude(33.7473).longitude(73.1390).build()
        ));
    }
}