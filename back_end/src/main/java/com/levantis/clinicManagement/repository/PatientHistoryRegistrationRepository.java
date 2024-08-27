package com.levantis.clinicManagement.repository;

import com.levantis.clinicManagement.entity.PatientHistory;
import com.levantis.clinicManagement.entity.PatientHistoryRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface PatientHistoryRegistrationRepository extends JpaRepository<PatientHistoryRegistration, Integer> {

    /* Get the history a registration belongs */
    @Query("SELECT pr.patientHistory FROM PatientHistoryRegistration pr where pr.patientHistoryRegistrationId = :patientHistoryRegistrationId")
    PatientHistory findByPatientHistoryRegistrationId(Integer patientHistoryRegistrationId);

    /* This is used in search function, both the criteria are used */
    @Query("SELECT phr FROM PatientHistoryRegistration phr " +
            "WHERE DATE(phr.patientHistoryRegistrationDateRegister) BETWEEN DATE(:startDateCriteria) AND DATE(:endDateCriteria) " +
            "AND phr.patientHistoryRegistrationHealthProblems LIKE %:healthProblemsCriteria% " +
            "AND phr.patientHistory.patient.patient_id = :patientID")
    List<PatientHistoryRegistration> findByPatientHistoryRegistrationDateRegisterAndPatientHistoryRegistrationHealthProblems(
            LocalDateTime startDateCriteria, LocalDateTime endDateCriteria, String healthProblemsCriteria, Integer patientID
    );

    /* Only the health problems are added as a criteria */
    @Query("SELECT phr FROM PatientHistoryRegistration phr " +
            "WHERE phr.patientHistoryRegistrationHealthProblems LIKE %:healthProblemsCriteria%"
            + " AND phr.patientHistory.patient.patient_id = :patientID")
    List<PatientHistoryRegistration> findByPatientHistoryRegistrationHealthProblems(String healthProblemsCriteria, Integer patientID);

    /* Only the date is added as search criteria */
    @Query("SELECT phr FROM PatientHistoryRegistration phr "
            + "WHERE DATE(phr.patientHistoryRegistrationDateRegister) BETWEEN DATE(:startDateCriteria) AND DATE(:endDateCriteria)"
            + " AND phr.patientHistory.patient.patient_id = :patientID")
    List<PatientHistoryRegistration> findByPatientHistoryRegistrationDateRegister(LocalDateTime startDateCriteria, LocalDateTime endDateCriteria, Integer patientID);
}
