package com.levantis.clinicManagement.repository;

import com.levantis.clinicManagement.entity.PatientHistory;
import com.levantis.clinicManagement.entity.PatientHistoryRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PatientHistoryRegistrationRepository extends JpaRepository<PatientHistoryRegistration, Integer> {

    /* Get the history a registration belongs */
    @Query("SELECT pr.patientHistory FROM PatientHistoryRegistration pr where pr.patientHistoryRegistrationId = :patientHistoryRegistrationId")
    PatientHistory findByPatientHistoryRegistrationId(Integer patientHistoryRegistrationId);

}
