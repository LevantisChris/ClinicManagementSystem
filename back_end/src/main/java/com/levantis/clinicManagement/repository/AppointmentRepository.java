package com.levantis.clinicManagement.repository;


import com.levantis.clinicManagement.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    @Query("SELECT a FROM Appointment a WHERE a.appointmentState.appointmentStateId = :status")
    List<Appointment> findByAppointmentState(@Param("status") Integer status);

    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate = :date AND a.appointmentState.appointmentStateDescription = :status")
    List<Appointment> findByAppointmentDateAndAppointmentState(@Param("date") Date date, @Param("status") String status);

    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate BETWEEN :startDate AND :endDate AND a.appointmentState.appointmentStateDescription = :status")
    List<Appointment> findByAppointmentDateBetweenAndAppointmentState(@Param("startDate") Date startDate, @Param("endDate") Date endDate, @Param("status") String status);

    @Query("SELECT a FROM Appointment a JOIN a.appointmentPatient p JOIN p.user u WHERE u.user_surname LIKE %:surname% AND a.appointmentState.appointmentStateDescription = :status")
    List<Appointment> findByPatientSurnameAndAppointmentState(@Param("surname") String surname, @Param("status") String status);

    @Query("SELECT a FROM Appointment a JOIN a.appointmentPatient p WHERE p.user.patient.patient_AMKA = :amka AND a.appointmentState.appointmentStateDescription = :status")
    List<Appointment> findByPatientAMKAAndAppointmentState(@Param("amka") String amka, @Param("status") String status);

    @Query("SELECT a FROM Appointment a JOIN a.appointmentPatient p JOIN p.user u WHERE a.appointmentDate BETWEEN :startDate AND :endDate AND u.user_surname LIKE %:surname% AND a.appointmentState.appointmentStateDescription = :status")
    List<Appointment> findByDateRangeAndPatientSurnameAndAppointmentState(@Param("startDate") Date startDate, @Param("endDate") Date endDate, @Param("surname") String surname, @Param("status") String status);

    @Query("SELECT a FROM Appointment a JOIN a.appointmentPatient p WHERE a.appointmentDate BETWEEN :startDate AND :endDate AND p.user.user_idNumber = :amka AND a.appointmentState.appointmentStateDescription = :status")
    List<Appointment> findByDateRangeAndPatientAMKAAndAppointmentState(@Param("startDate") Date startDate, @Param("endDate") Date endDate, @Param("amka") String amka, @Param("status") String status);
}
