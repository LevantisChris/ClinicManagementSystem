package com.levantis.clinicManagement.repository;

import com.levantis.clinicManagement.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Integer> {
    @Query("SELECT p FROM Patient p WHERE p.patient_AMKA = :amka")
    Optional<Patient> findByPatient_AMKA(String amka);

    @Query("SELECT p FROM Patient p WHERE p.patient_AMKA = :amka")
    List<Patient> findByPatient_AMKA_list(String amka);

    @Query("SELECT p from Patient p WHERE p.user.user_surname = :surname")
    List<Patient> findByPatientUser_List(String surname);

    @Query("SELECT p from Patient p WHERE p.user.user_surname = :surname")
    Patient findByPatientUser(String surname);

    @Query("SELECT p FROM Patient p WHERE p.patient_AMKA = :amka AND p.user.user_surname = :surname")
    List<Patient> findByPatient_AMKAAndUser(String surname, String amka);
}
