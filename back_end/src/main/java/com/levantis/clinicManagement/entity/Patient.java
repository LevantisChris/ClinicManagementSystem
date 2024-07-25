package com.levantis.clinicManagement.entity;

import jakarta.persistence.*;

import java.sql.Date;

@Entity
public class Patient {

    @Id
    @Column(name = "patient_id")
    private Integer patient_id;

    @Column(nullable = false, length = 11, unique = true)
    private String patient_AMKA;

    @Column(name = "patient_registrationDate", nullable = false)
    private Date patientRegistrationDate;

    @OneToOne
    @JoinColumn(name = "patient_id", referencedColumnName = "user_id", nullable = false)
    private User user;

}
