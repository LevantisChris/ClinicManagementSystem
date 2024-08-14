package com.levantis.clinicManagement.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.levantis.clinicManagement.entity.Appointment;
import lombok.Data;

import java.sql.Time;
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
    private Date appointmentDate;
    private Time appointmentStartTime;
    private Time appointmentEndTime;
    private String appointmentJustification;
    private Date appointmentCreationDate;
    private Integer appointmentStateId;

    // For the search ++
    private Date startDate;
    private Date endDate;
    private String patientSurname;
    private List<AppointmentDTO> appointmentList;

}
