package com.levantis.clinicManagement.repository;

import com.levantis.clinicManagement.entity.PatientHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface PatientHistoryRepository extends JpaRepository<PatientHistory, Integer> {

    @Query("SELECT pa FROM PatientHistory pa WHERE pa.patient.patient_id = :patientId")
    PatientHistory findByPatient(Integer patientId);

}
