package com.levantis.clinicManagement.repository;


import com.levantis.clinicManagement.dto.AppointmentDTO;
import com.levantis.clinicManagement.entity.Appointment;
import com.levantis.clinicManagement.entity.Doctor;
import com.levantis.clinicManagement.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    @Query("SELECT a FROM Appointment a WHERE a.appointmentState.appointmentStateId = :status")
    List<Appointment> findByAppointmentState(@Param("status") Integer status);

    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate = :date")
    List<Appointment> findByAppointmentDate(@Param("date") LocalDate date);

    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate BETWEEN :startDate AND :endDate")
    List<Appointment> findByAppointmentDateBetweenAndAppointmentState(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT a FROM Appointment a JOIN a.appointmentPatient p JOIN p.user u WHERE u.user_surname LIKE %:surname%")
    List<Appointment> findByPatientSurnameAndAppointmentState(@Param("surname") String surname);

    @Query("SELECT a FROM Appointment a JOIN a.appointmentPatient p WHERE p.user.patient.patient_AMKA = :amka")
    List<Appointment> findByPatientAMKA(@Param("amka") String amka);

    @Query("SELECT a FROM Appointment a JOIN a.appointmentPatient p JOIN p.user u WHERE a.appointmentDate BETWEEN :startDate AND :endDate AND u.user_surname LIKE %:surname% AND a.appointmentState.appointmentStateDescription = :status")
    List<Appointment> findByDateRangeAndPatientSurnameAndAppointmentState(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, @Param("surname") String surname, @Param("status") String status);

    @Query("SELECT a FROM Appointment a JOIN a.appointmentPatient p WHERE a.appointmentDate BETWEEN :startDate AND :endDate AND p.user.user_idNumber = :amka AND a.appointmentState.appointmentStateDescription = :status")
    List<Appointment> findByDateRangeAndPatientAMKAAndAppointmentState(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, @Param("amka") String amka, @Param("status") String status);

    @Query("SELECT a FROM Appointment a WHERE a.appointmentDoctor = :doctor_id AND a.appointmentDate = :date")
    List<Appointment> findByAppointmentDoctorAndAppointmentDate(@Param("doctor_id") Doctor doctor_id, @Param("date") LocalDate date);

    @Query("SELECT a FROM Appointment a WHERE a.appointmentPatient = :patient_id AND a.appointmentDate = :date")
    List<Appointment> findByAppointmentPatientAndAppointmentDate(@Param("patient_id") Patient patient_id, @Param("date") LocalDate date);

    @Query("SELECT a FROM Appointment a WHERE MONTH(a.appointmentDate) = MONTH(:date) AND YEAR(a.appointmentDate) = YEAR(:date)")
    List<Appointment> findAppointmentsByAppointmentDate(@Param("date") LocalDate date);

    /* Get all the appointments that are in the state Created and Respected */
    @Query("SELECT a " +
            "FROM Appointment a WHERE a.appointmentDoctor.doctor_id = :doctor_id AND (a.appointmentState.appointmentStateId = 1 OR a.appointmentState.appointmentStateId = 2)")
    List<Appointment> findByAppointmentStateAndDoctor(@Param("doctor_id") Integer doctor_id);
}
