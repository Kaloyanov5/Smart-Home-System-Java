package com.smarthome.controller;

import com.smarthome.model.Apartment;
import com.smarthome.repository.ApartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/apartments")
public class ApartmentController {

    @Autowired
    private ApartmentRepository apartmentRepository;

    @GetMapping
    public List<Apartment> getAllApartments() {
        return apartmentRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createApartment(@RequestBody Apartment newApartment) {
        if (apartmentRepository.existsByName(newApartment.getName())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("An apartment with that name already exists!");
        }
        Apartment savedApartment = apartmentRepository.save(newApartment);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedApartment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApartment(@PathVariable Long id) {
        if (!apartmentRepository.existsById(id)) {
            return ResponseEntity.notFound().build(); // If not found return 404
        }

        apartmentRepository.deleteById(id);
        return ResponseEntity.noContent().build(); // On success return 204
    }
}
