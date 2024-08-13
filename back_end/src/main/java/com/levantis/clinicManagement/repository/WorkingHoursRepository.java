package com.levantis.clinicManagement.repository;

import com.levantis.clinicManagement.entity.WorkingHours;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkingHoursRepository extends JpaRepository<WorkingHours, Integer> {
}
