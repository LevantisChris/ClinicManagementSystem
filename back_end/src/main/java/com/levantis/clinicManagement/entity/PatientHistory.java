package com.levantis.clinicManagement.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class PatientHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "history_id")
    private Integer historyId;

    @OneToOne
    @JoinColumn(name = "history_patient_id", referencedColumnName = "patient_id", nullable = false)
    private Patient patient;

    @OneToMany(mappedBy = "patientHistory", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PatientHistoryRegistration> patientHistoryRegistrations = new ArrayList<>();

    public Integer getHistoryId() {
        return historyId;
    }

    public void setHistoryId(Integer historyId) {
        this.historyId = historyId;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public List<PatientHistoryRegistration> getPatientHistoryRegistrations() {
        return patientHistoryRegistrations;
    }

    public void setPatientHistoryRegistrations(List<PatientHistoryRegistration> patientHistoryRegistrations) {
        this.patientHistoryRegistrations = patientHistoryRegistrations;
    }

    public void addPatientHistoryRegistration(PatientHistoryRegistration registration) {
        patientHistoryRegistrations.add(registration);
        registration.setPatientHistory(this);
    }

    public void removePatientHistoryRegistration(PatientHistoryRegistration registration) {
        patientHistoryRegistrations.remove(registration);
        registration.setPatientHistory(null);
    }
}
