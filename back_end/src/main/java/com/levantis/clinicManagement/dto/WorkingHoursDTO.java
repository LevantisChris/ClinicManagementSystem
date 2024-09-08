package com.levantis.clinicManagement.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.levantis.clinicManagement.entity.Doctor;
import com.levantis.clinicManagement.entity.WorkingHours;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class WorkingHoursDTO {

    private int statusCode;
    private String error;
    private String message;
    private String token;
    private String refreshToken;
    private String expirationTime;

    private Integer workingHoursId;
    private LocalDate workingHoursDate;
    private Integer doctorId;
    private Doctor doctor; // the doctor, the WH owned
    private List<WorkingHours> whList;
    private LocalTime startTime;
    private LocalTime endTime;
}
