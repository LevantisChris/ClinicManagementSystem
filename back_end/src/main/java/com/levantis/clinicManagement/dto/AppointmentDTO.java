package com.levantis.clinicManagement.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.levantis.clinicManagement.entity.AppointmentState;
import com.levantis.clinicManagement.entity.Doctor;
import lombok.Data;

import java.sql.Time;
import java.util.Date;

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
    private Date appointmentDate;
    private Time appointmentStartTime;
    private Time appointmentEndTime;
    private String appointmentJustification;
    private Date appointmentCreationDate;
    private Integer appointmentStateId;

}
