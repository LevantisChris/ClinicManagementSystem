package com.levantis.clinicManagement.entity;

import jakarta.persistence.*;

import java.sql.Time;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "appointment_id")
    private Integer appointmentId;

    @Column(name = "appointment_date", nullable = false)
    private LocalDate appointmentDate;

    @Column(name = "appointment_start_time", nullable = false)
    private Time appointmentStartTime;

    @Column(name = "appointment_end_time", nullable = false)
    private Time appointmentEndTime;

    @Column(name = "appointment_justification", length = 500, nullable = false)
    private String appointmentJustification;

    @Column(name = "appointment_creationDate", nullable = false)
    private Date appointmentCreationDate;

    @ManyToOne
    @JoinColumn(name = "appointment_state", referencedColumnName = "appointment_state_id", nullable = false)
    private AppointmentState appointmentState;

    @ManyToOne
    @JoinColumn(name = "patient_id", referencedColumnName = "patient_id", nullable = false)
    private Patient appointmentPatient;

    /* For an appointment is responsible a doctor. One doctor has multiple appointments. */
    @ManyToOne
    @JoinColumn(name = "doctor_id", referencedColumnName = "doctor_id", nullable = false)
    private Doctor appointmentDoctor;

    @OneToMany(mappedBy = "appointment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PatientHistoryRegistration> patientHistoryRegistrations = new ArrayList<>();

    public Integer getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Integer appointmentId) {
        this.appointmentId = appointmentId;
    }

    public LocalDate getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDate appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public Time getAppointmentStartTime() {
        return appointmentStartTime;
    }

    public void setAppointmentStartTime(Time appointmentStartTime) {
        this.appointmentStartTime = appointmentStartTime;
    }

    public Time getAppointmentEndTime() {
        return appointmentEndTime;
    }

    public void setAppointmentEndTime(Time appointmentEndTime) {
        this.appointmentEndTime = appointmentEndTime;
    }

    public String getAppointmentJustification() {
        return appointmentJustification;
    }

    public void setAppointmentJustification(String appointmentJustification) {
        this.appointmentJustification = appointmentJustification;
    }

    public Date getAppointmentCreationDate() {
        return appointmentCreationDate;
    }

    public void setAppointmentCreationDate(Date appointmentCreationDate) {
        this.appointmentCreationDate = appointmentCreationDate;
    }

    public AppointmentState getAppointmentState() {
        return appointmentState;
    }

    public void setAppointmentState(AppointmentState appointmentState) {
        this.appointmentState = appointmentState;
    }

    public Patient getAppointmentPatient() {
        return appointmentPatient;
    }

    public void setAppointmentPatient(Patient appointmentPatient) {
        this.appointmentPatient = appointmentPatient;
    }

    public Doctor getAppointmentDoctor() {
        return appointmentDoctor;
    }

    public void setAppointmentDoctor(Doctor appointmentDoctor) {
        this.appointmentDoctor = appointmentDoctor;
    }

    public List<PatientHistoryRegistration> getPatientHistoryRegistrations() {
        return patientHistoryRegistrations;
    }

    public void setPatientHistoryRegistrations(List<PatientHistoryRegistration> patientHistoryRegistrations) {
        this.patientHistoryRegistrations = patientHistoryRegistrations;
    }
}
