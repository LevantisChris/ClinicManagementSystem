package com.levantis.clinicManagement.repository;

import com.levantis.clinicManagement.entity.Doctor;
import com.levantis.clinicManagement.entity.WorkingHours;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface WorkingHoursRepository extends JpaRepository<WorkingHours, Integer> {
    WorkingHours findByDateAndStartTimeAndEndTime(LocalDate date, LocalTime startTime, LocalTime endTime);
    List<WorkingHours> findByDoctor(Doctor doctor);
}
