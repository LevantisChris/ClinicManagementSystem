package com.levantis.clinicManagement.entity;

import jakarta.persistence.*;

import java.sql.Date;

@Entity
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "patient_id")
    private Integer patient_id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 11, unique = true)
    private String patient_AMKA;

    @Column(name = "patient_registrationDate", nullable = false)
    private Date patientRegistrationDate;

    public Integer getPatient_id() {
        return patient_id;
    }

    public void setPatient_id(Integer patient_id) {
        this.patient_id = patient_id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getPatient_AMKA() {
        return patient_AMKA;
    }

    public void setPatient_AMKA(String patient_AMKA) {
        this.patient_AMKA = patient_AMKA;
    }

    public Date getPatientRegistrationDate() {
        return patientRegistrationDate;
    }

    public void setPatientRegistrationDate(Date patientRegistrationDate) {
        this.patientRegistrationDate = patientRegistrationDate;
    }
}
