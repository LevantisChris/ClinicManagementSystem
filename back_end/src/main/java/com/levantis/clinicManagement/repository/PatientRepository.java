package com.levantis.clinicManagement.repository;

import com.levantis.clinicManagement.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Integer> {
    @Query("SELECT p FROM Patient p WHERE p.patient_AMKA = :amka")
    Optional<Patient> findByPatient_AMKA(String amka);
}
