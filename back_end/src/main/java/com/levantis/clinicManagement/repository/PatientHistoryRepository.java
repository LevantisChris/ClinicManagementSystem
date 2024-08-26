package com.levantis.clinicManagement.repository;

import com.levantis.clinicManagement.entity.PatientHistory;
import com.levantis.clinicManagement.entity.PatientHistoryRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PatientHistoryRepository extends JpaRepository<PatientHistory, Integer> {

    @Query("SELECT pa FROM PatientHistory pa WHERE pa.patient.patient_id = :patientId")
    PatientHistory findByPatient(Integer patientId);

    @Query("SELECT pr FROM PatientHistory pa JOIN pa.patientHistoryRegistrations pr WHERE pa.patient.patient_id = :patientId ORDER BY pr.patientHistoryRegistrationDateRegister desc ")
    List<PatientHistoryRegistration> findByPatientId(Integer patientId);

}
