package com.levantis.clinicManagement.service;

import com.levantis.clinicManagement.dto.AppointmentDTO;
import com.levantis.clinicManagement.dto.WorkingHoursDTO;
import com.levantis.clinicManagement.entity.Appointment;
import com.levantis.clinicManagement.entity.Doctor;
import com.levantis.clinicManagement.entity.User;
import com.levantis.clinicManagement.entity.WorkingHours;
import com.levantis.clinicManagement.repository.AppointmentRepository;
import com.levantis.clinicManagement.repository.DoctorRepository;
import com.levantis.clinicManagement.repository.UserRepository;
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
    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private UserRepository userRepository;


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
                            .orElseThrow(() -> new RuntimeException("Doctor not found (in defining working hours)."));
            workingHours.setDoctor(doctor);
            workingHours.setDate(registrationRequest.getWorkingHoursDate());
            workingHours.setStartTime(registrationRequest.getStartTime());
            workingHours.setEndTime(registrationRequest.getEndTime());

            WorkingHours workingHoursResult = workingHoursRepository.save(workingHours);

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

    /* The user can delete an existing Working Hour statement.
    *  This can be done based on the date and the start and end time.*/
    public WorkingHoursDTO deleteWorkingHours(WorkingHoursDTO registrationRequest) {
        WorkingHoursDTO resp = new WorkingHoursDTO();
        if(registrationRequest.getWorkingHoursDate() == null
                || registrationRequest.getStartTime() == null
                || registrationRequest.getEndTime() == null) {
            log.error("Empty/null fields");
            resp.setMessage("Empty/null fields.");
            resp.setStatusCode(500);
            return resp;
        }
        try {
            // Find the working hours record based on the given criteria
            WorkingHours workingHours = workingHoursRepository.findByDateAndStartTimeAndEndTime(
                    registrationRequest.getWorkingHoursDate(),
                    registrationRequest.getStartTime(),
                    registrationRequest.getEndTime()
            );

            if (workingHours != null) {
                // Delete the working hours record
                workingHoursRepository.delete(workingHours);

                resp.setMessage("Working hours successfully deleted.");
                resp.setStatusCode(200);
            } else {
                log.error("Working hours not found.");
                resp.setMessage("Working hours not found.");
                resp.setStatusCode(404);
            }
        } catch (Exception e) {
            log.error("Error in deleting the working hours: " + e.getMessage(), e);
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    public AppointmentDTO createAppointment(AppointmentDTO registrationRequest) {
        AppointmentDTO resp = new AppointmentDTO();
        if(registrationRequest.getAppointmentDoctorEmail() == null
            || registrationRequest.getAppointmentDate() == null
            || registrationRequest.getAppointmentTime() == null
            || registrationRequest.getAppointmentJustification() == null
            || registrationRequest.getAppointmentState() == null) {
            log.error("Empty/null fields");
            resp.setMessage("Empty/null fields.");
            resp.setStatusCode(500);
            return resp;
        }
        try {
            Appointment appointment = new Appointment();

            Doctor doctor = doctorRepository.findByEmail(registrationRequest.getAppointmentDoctorEmail())
                        .orElseThrow(() -> new RuntimeException("Doctor (Email) not found"));

            appointment.setAppointmentDoctor(doctor);
            appointment.setAppointmentDate(registrationRequest.getAppointmentDate());
            appointment.setAppointmentTime(registrationRequest.getAppointmentTime());
            appointment.setAppointmentJustification(registrationRequest.getAppointmentJustification());
            appointment.setAppointmentState(registrationRequest.getAppointmentState());

            Appointment appointmentResult = appointmentRepository.save(appointment);
            if (appointmentResult.getAppointmentId() != null) {
                // If the save was successful, populate the response DTO
                resp.setAppointmentId(appointmentResult.getAppointmentId());
                resp.setAppointmentDoctorEmail(appointmentResult.getAppointmentDoctor().getUser().getEmail());
                resp.setAppointmentDate(appointmentResult.getAppointmentDate());
                resp.setAppointmentTime(appointmentResult.getAppointmentTime());
                resp.setAppointmentJustification(appointmentResult.getAppointmentJustification());
                resp.setAppointmentState(appointmentResult.getAppointmentState());
                resp.setMessage("Appointment successfully created.");
                resp.setStatusCode(200);
            } else {
                log.error("Failed to create appointment.");
                resp.setMessage("Failed to create appointment.");
                resp.setStatusCode(500);
            }
        } catch (Exception e) {
            log.error("Error in creation of the appointment: {}", e.getMessage());
            e.printStackTrace();
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }
}
