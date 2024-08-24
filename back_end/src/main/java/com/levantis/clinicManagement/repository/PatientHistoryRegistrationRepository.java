package com.levantis.clinicManagement.repository;

import com.levantis.clinicManagement.entity.PatientHistoryRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientHistoryRegistrationRepository extends JpaRepository<PatientHistoryRegistration, Integer> {
}
