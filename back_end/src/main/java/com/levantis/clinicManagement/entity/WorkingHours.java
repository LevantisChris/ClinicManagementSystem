package com.levantis.clinicManagement.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
public class WorkingHours {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "working_hours_id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "working_hours_doctor_id", nullable = false)
    private Doctor doctor;

    @Column(name = "working_hours_date", nullable = false)
    private LocalDate date; // Specific date for the working hours

    @Column(name = "working_hours_start_time", nullable = false)
    private LocalTime startTime; // Start time of the interval

    @Column(name = "working_hours_end_time", nullable = false)
    private LocalTime endTime; // End time of the interval


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

}
