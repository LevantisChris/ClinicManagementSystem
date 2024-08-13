package com.levantis.clinicManagement.repository;

import com.levantis.clinicManagement.entity.WorkingHours;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;

public interface WorkingHoursRepository extends JpaRepository<WorkingHours, Integer> {
    WorkingHours findByDateAndStartTimeAndEndTime(LocalDate date, LocalTime startTime, LocalTime endTime);
}
