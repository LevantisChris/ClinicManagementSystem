package com.levantis.clinicManagement.entity;

import jakarta.persistence.*;

import java.sql.Time;
import java.util.Date;

@Entity
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "appointment_id")
    private Integer appointmentId;

    @Column(name = "appointment_date", nullable = false)
    private Date appointmentDate;

    @Column(name = "appointment_time", nullable = false)
    private Time appointmentTime;

    @Column(name = "appointment_justification", length = 500, nullable = false)
    private String appointmentJustification;

    @Column(name = "appointment_creationDate", nullable = false)
    private Date appointmentCreationDate;

    @ManyToOne
    @JoinColumn(name = "appointment_state", referencedColumnName = "appointment_state_id", nullable = false)
    private AppointmentState appointmentState;

}
