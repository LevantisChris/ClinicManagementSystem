package com.levantis.clinicManagement.service;

import com.levantis.clinicManagement.dto.WorkingHoursDTO;
import com.levantis.clinicManagement.entity.Doctor;
import com.levantis.clinicManagement.entity.WorkingHours;
import com.levantis.clinicManagement.repository.DoctorRepository;
import com.levantis.clinicManagement.repository.WorkingHoursRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AppointmentManagementService {

    private static final Logger log = LoggerFactory.getLogger(AppointmentManagementService.class);

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private WorkingHoursRepository workingHoursRepository;


    public AppointmentManagementService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public WorkingHoursDTO defineWorkingHours(WorkingHoursDTO registrationRequest) {
        WorkingHoursDTO resp = new WorkingHoursDTO();
        if(registrationRequest.getDoctorId() == null
            || registrationRequest.getWorkingHoursDate() == null
            || registrationRequest.getStartTime() == null
            || registrationRequest.getEndTime() == null) {
            log.error("Empty/null fields");
            resp.setMessage("Empty/null fields.");
            resp.setStatusCode(500);
            return resp;
        }
        try {

            WorkingHours workingHours = new WorkingHours();
            workingHours.setId(registrationRequest.getWorkingHoursId());
            // Get the doctor that correspond to that request
            Doctor doctor = doctorRepository.findById(registrationRequest.getDoctorId())
                            .orElseThrow(() -> new RuntimeException("Doctor not found (in defining working hours) ..."));
            workingHours.setDoctor(doctor);
            workingHours.setDate(registrationRequest.getWorkingHoursDate());
            workingHours.setStartTime(registrationRequest.getStartTime());
            workingHours.setEndTime(registrationRequest.getEndTime());

            WorkingHours workingHoursResult =workingHoursRepository.save(workingHours);

            if (workingHoursResult.getId() != null) {
                // If the save was successful, populate the response DTO
                resp.setWorkingHoursId(workingHoursResult.getId());
                resp.setDoctorId(workingHoursResult.getDoctor().getDoctor_id());
                resp.setWorkingHoursDate(workingHoursResult.getDate());
                resp.setStartTime(workingHoursResult.getStartTime());
                resp.setEndTime(workingHoursResult.getEndTime());
                resp.setMessage("Working hours successfully defined.");
                resp.setStatusCode(200);
            } else {
                log.error("Failed to save working hours.");
                resp.setMessage("Failed to save working hours.");
                resp.setStatusCode(500);
            }

        } catch (Exception e) {
            log.error("Error in defining the working hours: " + e.getMessage());
            e.printStackTrace();
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }
}
