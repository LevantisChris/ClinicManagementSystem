package com.levantis.clinicManagement.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.Date;

@Entity
public class PatientHistoryRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "p_History_registration_id")
    private int patientHistoryRegistrationId;

    @Column(name = "p_History_registration_dateRegister", nullable = false)
    private LocalDate patientHistoryRegistrationDateRegister;

    @Column(name = "p_History_registration_health_problems", nullable = false)
    private String patientHistoryRegistrationHealthProblems;

    @Column(name = "p_History_registration_treatment", nullable = false)
    private String patientHistoryRegistrationTreatment;

    @ManyToOne
    @JoinColumn(name = "patientHistoryId", referencedColumnName = "history_id", nullable = false)
    private PatientHistory patientHistory;

    public int getPatientHistoryRegistrationId() {
        return patientHistoryRegistrationId;
    }

    public void setPatientHistoryRegistrationId(int patientHistoryRegistrationId) {
        this.patientHistoryRegistrationId = patientHistoryRegistrationId;
    }

    public LocalDate getPatientHistoryRegistrationDateRegister() {
        return patientHistoryRegistrationDateRegister;
    }

    public void setPatientHistoryRegistrationDateRegister(LocalDate patientHistoryRegistrationDateRegister) {
        this.patientHistoryRegistrationDateRegister = patientHistoryRegistrationDateRegister;
    }

    public String getPatientHistoryRegistrationHealthProblems() {
        return patientHistoryRegistrationHealthProblems;
    }

    public void setPatientHistoryRegistrationHealthProblems(String patientHistoryRegistrationHealthProblems) {
        this.patientHistoryRegistrationHealthProblems = patientHistoryRegistrationHealthProblems;
    }

    public String getPatientHistoryRegistrationTreatment() {
        return patientHistoryRegistrationTreatment;
    }

    public void setPatientHistoryRegistrationTreatment(String patientHistoryRegistrationTreatment) {
        this.patientHistoryRegistrationTreatment = patientHistoryRegistrationTreatment;
    }

    public PatientHistory getPatientHistory() {
        return patientHistory;
    }

    public void setPatientHistory(PatientHistory patientHistory) {
        this.patientHistory = patientHistory;
    }
}
