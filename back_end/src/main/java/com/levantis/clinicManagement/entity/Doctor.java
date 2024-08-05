package com.levantis.clinicManagement.entity;

import jakarta.persistence.*;

@Entity
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "doctor_id")
    private Integer doctor_id;

    @OneToOne
    @JoinColumn(name = "doctor_id", referencedColumnName = "user_id", nullable = false)
    private User user;

    @OneToOne
    @JoinColumn(name = "doctor_speciality", referencedColumnName = "speciality_id", nullable = false)
    private DoctorSpeciality doctorSpeciality;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public DoctorSpeciality getDoctorSpeciality() {
        return doctorSpeciality;
    }

    public void setDoctorSpeciality(DoctorSpeciality doctorSpeciality) {
        this.doctorSpeciality = doctorSpeciality;
    }

    public Integer getDoctor_id() {
        return doctor_id;
    }

    public void setDoctor_id(Integer doctor_id) {
        this.doctor_id = doctor_id;
    }
}
