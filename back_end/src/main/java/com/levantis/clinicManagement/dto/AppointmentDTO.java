package com.levantis.clinicManagement.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.levantis.clinicManagement.entity.Patient;
import lombok.Data;

import java.sql.Time;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class AppointmentDTO {
    private int statusCode;
    private String error;
    private String message;
    private String token;
    private String refreshToken;
    private String expirationTime;

    private Integer appointmentId;
    private String appointmentDoctorEmail;
    private String appointmentPatientAMKA; // AMKA is unique in the database
    private LocalDate appointmentDate;
    private Time appointmentStartTime;
    private Time appointmentEndTime;
    private String appointmentJustification;
    private Date appointmentCreationDate;
    private Integer appointmentStateId;

    // For the search ++
    private LocalDate startDate;
    private LocalDate endDate;
    private String patientSurname;
    private List<AppointmentDTO> appointmentList;
    // for the search (based on ID), to include more info
    /* Info for the appointment */
    private Integer appointmentDoctorId;
    private String appointmentDoctorName;
    private String appointmentDoctorSurname;
    private String appointmentDoctorSpeciality;
    /* Info for the Patient */
    private Patient appointmentPatient;

}
