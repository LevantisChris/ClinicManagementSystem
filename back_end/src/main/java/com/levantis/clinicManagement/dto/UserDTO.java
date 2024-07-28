package com.levantis.clinicManagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class UserDTO {

    private Integer userId;
    private String userName;
    private String userSurname;
    private String userIdNumber;
    private String userEmail;
    private Integer roleId;
    private String roleName;
    // Optional
    private Integer patientId;
    private Integer doctorId;
}
