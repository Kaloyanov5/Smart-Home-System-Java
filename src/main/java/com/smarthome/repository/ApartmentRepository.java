package com.smarthome.repository;

import com.smarthome.model.Apartment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApartmentRepository extends JpaRepository<Apartment, Long> {
    boolean existsByName(String name);
}
