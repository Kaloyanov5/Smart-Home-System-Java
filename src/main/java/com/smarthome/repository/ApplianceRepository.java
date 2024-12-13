package com.smarthome.repository;

import com.smarthome.model.Appliance;
import com.smarthome.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplianceRepository extends JpaRepository<Appliance, Long> {
    List<Appliance> findByRoom(Room room);
}
