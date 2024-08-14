package com.levantis.clinicManagement.repository;

import com.levantis.clinicManagement.entity.AppointmentState;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentStateRepository extends JpaRepository<AppointmentState, Integer> {
    AppointmentState findByAppointmentStateId(int appointmentId);
}
