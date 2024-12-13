package com.smarthome.controller;

import com.smarthome.model.Appliance;
import com.smarthome.model.Room;
import com.smarthome.repository.ApplianceRepository;
import com.smarthome.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/appliances")
public class ApplianceController {

    @Autowired
    private ApplianceRepository applianceRepository;

    @Autowired
    private RoomRepository roomRepository;

    public ApplianceController(ApplianceRepository applianceRepository, RoomRepository roomRepository) {
        this.applianceRepository = applianceRepository;
        this.roomRepository = roomRepository;
    }

    @GetMapping
    public ResponseEntity<List<Appliance>> getAllAppliances() {
        List<Appliance> appliances = applianceRepository.findAll();
        return ResponseEntity.ok(appliances); // If OK return 200
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appliance> getApplianceById(@PathVariable Long id) {
        Optional<Appliance> appliance = applianceRepository.findById(id);
        if (appliance.isPresent()) {
            return ResponseEntity.ok(appliance.get());
        } else {
            return ResponseEntity.notFound().build(); // If not found return 404
        }
    }

    @GetMapping("/room/{roomId}")
    public List<Appliance> getAppliancesByRoom(@PathVariable Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Room not found with ID: " + roomId));
        return applianceRepository.findByRoom(room);
    }

    @PostMapping
    public Appliance createAppliance(@RequestBody Appliance appliance, @RequestParam Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Room not found with ID: " + roomId));
        appliance.setRoom(room);
        return applianceRepository.save(appliance);
    }

    @PatchMapping("/{id}/toggle")
    public Appliance toggleAppliance(@PathVariable Long id) {
        Appliance appliance = applianceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Appliance not found with ID: " + id));
        appliance.setOn(!appliance.isOn());
        return applianceRepository.save(appliance);
    }

    /*
    // FIX FIX FIX FIX FIX
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> deleteAppliance(@PathVariable Long id) {
        if (!applianceRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        applianceRepository.deleteById(id);
        applianceRepository.flush(); // Ensure deletion is flushed to the database
        return ResponseEntity.noContent().build();
    }
     */
}
