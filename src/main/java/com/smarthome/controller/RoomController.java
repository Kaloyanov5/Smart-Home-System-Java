package com.smarthome.controller;

import com.smarthome.model.Room;
import com.smarthome.model.Apartment;
import com.smarthome.repository.RoomRepository;
import com.smarthome.repository.ApartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private ApartmentRepository apartmentRepository;

    @PostMapping
    public Room createRoom(@RequestBody Room room, @RequestParam Long apartmentId) {
        Apartment apartment = apartmentRepository.findById(apartmentId)
                .orElseThrow(() -> new IllegalArgumentException("Apartment not found with ID: " + apartmentId));

        room.setApartment(apartment);

        return roomRepository.save(room);
    }

    @GetMapping("/apartment/{apartmentId}")
    public List<Room> getRoomsByApartment(@PathVariable Long apartmentId) {
        return roomRepository.findByApartmentId(apartmentId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        if (!roomRepository.existsById(id)) {
            return ResponseEntity.notFound().build(); // If not found return 404
        }

        roomRepository.deleteById(id);
        return ResponseEntity.noContent().build(); // If success return 204
    }
}
