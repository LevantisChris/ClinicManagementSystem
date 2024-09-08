package com.levantis.clinicManagement.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.levantis.clinicManagement.entity.Doctor;
import com.levantis.clinicManagement.entity.Patient;
import com.levantis.clinicManagement.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true) /* Default is false  */
public class UserDTO {

    private int statusCode;
    private String error;
    private String message;
    private String token;
    private String refreshToken;
    private String expirationTime;
    //
    private Integer userId;
    private String userName;
    private String userSurname;
    private String userIdNumber;
    private String userEmail;
    private Integer roleId;
    private String roleName;
    private String userPassword;
    //
    private String patientAMKA; // for patient
    private Integer doctorSpecialityId; // for doctor
    // Optional
    private Integer patientId;
    private Integer doctorId;
    //
    private User users;
    private List<User> userList;
    private Patient patient;
}
