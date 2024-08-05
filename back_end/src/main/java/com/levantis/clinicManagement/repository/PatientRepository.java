package com.levantis.clinicManagement.repository;

import com.levantis.clinicManagement.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, Integer> {
}
