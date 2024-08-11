package com.levantis.clinicManagement.entity;

import jakarta.persistence.*;
import java.util.Set;

@Entity
public class DoctorSpeciality {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "speciality_id")
    private Integer specialityId;

    @Column(name = "speciality_description", nullable = false, length = 200)
    private String specialityDescription;

    @OneToMany(mappedBy = "doctorSpeciality")
    private Set<Doctor> doctors; // This represents the one-to-many relationship

    // Getters and setters
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

    public Set<Doctor> getDoctors() {
        return doctors;
    }

    public void setDoctors(Set<Doctor> doctors) {
        this.doctors = doctors;
    }
}
