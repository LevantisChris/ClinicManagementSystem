package com.levantis.clinicManagement.entity;

import jakarta.persistence.*;

@Entity
public class DoctorSpeciality {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "speciality_id")
    private Integer specialityId;

    @Column(name = "speciality_description", nullable = false, length = 200)
    private String specialityDescription;

    @OneToOne(mappedBy = "doctorSpeciality")
    private Doctor doctor;



    public Integer getSpecialityId() {
        return specialityId;
    }

    public void setSpecialityId(Integer specialityId) {
        this.specialityId = specialityId;
    }

    public String getSpecialityDescription() {
        return specialityDescription;
    }

    public void setSpecialityDescription(String specialityDescription) {
        this.specialityDescription = specialityDescription;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }
}
