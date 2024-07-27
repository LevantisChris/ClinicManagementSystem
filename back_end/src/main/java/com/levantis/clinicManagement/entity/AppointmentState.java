package com.levantis.clinicManagement.entity;

import jakarta.persistence.*;

import java.util.Set;

@Entity
public class AppointmentState {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "appointment_state_id")
    private Integer appointmentStateId;

    @Column(name = "appointment_state_description", length = 20, nullable = false)
    private String appointmentStateDescription;


    @OneToMany(mappedBy = "appointmentState")
    private Set<Appointment> appointments;

}
