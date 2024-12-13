package com.smarthome.repository;

import com.smarthome.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByApartmentId(Long apartmentId);
}
