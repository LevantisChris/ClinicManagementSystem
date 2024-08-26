package com.levantis.clinicManagement.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.levantis.clinicManagement.entity.Patient;
import com.levantis.clinicManagement.entity.PatientHistory;
import com.levantis.clinicManagement.entity.PatientHistoryRegistration;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class PatientHistoryDTO {

    private int statusCode;
    private String error;
    private String message;
    private String token;
    private String refreshToken;
    private String expirationTime;
    //
    // Patient History
    private Integer historyId;
    private Integer patientId;
    private Patient patient;
    private List<PatientHistoryRegistration> patientHistoryRegistrations;
    // Patient History Registration
    private Integer patientHistoryRegistrationId;
    private LocalDateTime patientHistoryRegistrationDateRegister;
    private String patientHistoryRegistrationHealthProblems;
    private String patientHistoryRegistrationTreatment;
    //
    //private PatientHistory patientHistory;

}
