package com.levantis.clinicManagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class SignUpDTO {

    private String name;
    private String surName;
    private String email;
    private String idNumber;
    private String amka; // if Patient sign up
    private String doctorType; // if doctor sign up
    private String password;
}
