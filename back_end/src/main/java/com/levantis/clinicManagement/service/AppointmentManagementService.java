package com.levantis.clinicManagement.service;

import com.levantis.clinicManagement.dto.AppointmentDTO;
import com.levantis.clinicManagement.dto.WorkingHoursDTO;
import com.levantis.clinicManagement.entity.*;
import com.levantis.clinicManagement.repository.*;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Date;
import java.util.Objects;

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
    @Autowired
    private AppointmentStateRepository appointmentStateRepository;
    @Autowired
    private JwtUtils jwtUtils;
    @Autowired
    private PatientRepository patientRepository;


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
            || registrationRequest.getAppointmentStartTime() == null
            || registrationRequest.getAppointmentEndTime() == null
            || registrationRequest.getAppointmentJustification() == null
            || registrationRequest.getAppointmentPatientAMKA() == null
            || registrationRequest.getAppointmentStateId() == null) {
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

            Patient patient = patientRepository.findByPatient_AMKA(registrationRequest.getAppointmentPatientAMKA())
                            .orElseThrow(() -> new RuntimeException("Patient (AMKA) not found"));
            appointment.setAppointmentPatient(patient);

            appointment.setAppointmentDate(registrationRequest.getAppointmentDate());
            appointment.setAppointmentStartTime(registrationRequest.getAppointmentStartTime());
            appointment.setAppointmentEndTime(registrationRequest.getAppointmentEndTime());
            appointment.setAppointmentJustification(registrationRequest.getAppointmentJustification());
            appointment.setAppointmentCreationDate(new Date());

            AppointmentState appointmentState =
                    appointmentStateRepository.findById(registrationRequest.getAppointmentStateId())
                                    .orElseThrow(() -> new RuntimeException("Appointment State not found"));
            appointment.setAppointmentState(appointmentState);

            Appointment appointmentResult = appointmentRepository.save(appointment);

            if (appointmentResult.getAppointmentId() != null) {
                // If the save was successful, populate the response DTO
                resp.setAppointmentId(appointmentResult.getAppointmentId());
                resp.setAppointmentDoctorEmail(appointmentResult.getAppointmentDoctor().getUser().getEmail());
                resp.setAppointmentPatientAMKA(appointmentResult.getAppointmentPatient().getUser().getEmail());
                resp.setAppointmentDate(appointmentResult.getAppointmentDate());
                resp.setAppointmentStartTime(appointmentResult.getAppointmentStartTime());
                resp.setAppointmentEndTime(appointmentResult.getAppointmentEndTime());
                resp.setAppointmentJustification(appointmentResult.getAppointmentJustification());
                resp.setAppointmentStateId(appointmentResult.getAppointmentState().getAppointmentStateId());
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

    public AppointmentDTO updateAppointment(AppointmentDTO registrationRequest) {
        AppointmentDTO resp = new AppointmentDTO();
        /* Must access the token */
        String jwtToken = getToken();
        if (jwtToken == null) {
            log.error("Empty/null token");
            resp.setMessage("Empty/null token.");
            resp.setStatusCode(500);
            return resp;
        }

        if(registrationRequest.getAppointmentDate() == null
                || registrationRequest.getAppointmentStartTime() == null
                || registrationRequest.getAppointmentEndTime() == null) {
            log.error("Empty/null fields");
            resp.setMessage("Empty/null fields.");
            resp.setStatusCode(500);
            return resp;
        }
        try {
            Appointment appointment = appointmentRepository.findById(registrationRequest.getAppointmentId())
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));

            appointment.setAppointmentDate(registrationRequest.getAppointmentDate());
            appointment.setAppointmentStartTime(registrationRequest.getAppointmentStartTime());
            appointment.setAppointmentEndTime(registrationRequest.getAppointmentEndTime());
            /* Only a secretary and a doctor can change the appointment State */
            if(jwtUtils.extractRole(jwtToken).equals("USER_DOCTOR")
                    || jwtUtils.extractRole(jwtToken).equals("USER_SECRETARY")) {
                log.info("Updating also the appointment State, the role is: {}", jwtUtils.extractRole(jwtToken));
                appointment.setAppointmentState(
                        appointmentStateRepository.findByAppointmentStateId(registrationRequest.getAppointmentStateId()));
            }
            Appointment updatedAppointmentResult = appointmentRepository.save(appointment);

            if (updatedAppointmentResult.getAppointmentId() != null) {
                // If the save was successful, populate the response DTO
                resp.setAppointmentId(updatedAppointmentResult.getAppointmentId());
                resp.setAppointmentDoctorEmail(updatedAppointmentResult.getAppointmentDoctor().getUser().getEmail());
                resp.setAppointmentPatientAMKA(updatedAppointmentResult.getAppointmentPatient().getPatient_AMKA());
                resp.setAppointmentDate(updatedAppointmentResult.getAppointmentDate());
                resp.setAppointmentStartTime(updatedAppointmentResult.getAppointmentStartTime());
                resp.setAppointmentEndTime(updatedAppointmentResult.getAppointmentEndTime());
                resp.setAppointmentJustification(updatedAppointmentResult.getAppointmentJustification());
                resp.setAppointmentStateId(updatedAppointmentResult.getAppointmentState().getAppointmentStateId());
                resp.setMessage("Appointment successfully updated.");
                resp.setStatusCode(200);
            } else {
                log.error("Failed to update appointment with id {}", updatedAppointmentResult.getAppointmentId());
                resp.setMessage("Failed to update appointment with id: " + updatedAppointmentResult.getAppointmentId());
                resp.setStatusCode(500);
            }
        } catch (Exception e) {
            log.error("Error in updating appointment: {}", e.getMessage());
            e.printStackTrace();
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    /* Update an appointment state (appointmentStateId) to Cancelled (state: 4) *
     * The update will be done automatically, no need the JSON request to have
     * the appointmentStateId in it. We inly need the appointment id.*/
    public AppointmentDTO cancelAppointment(AppointmentDTO registrationRequest) {
        AppointmentDTO resp = new AppointmentDTO();
        if(registrationRequest.getAppointmentId() == null) {
            log.error("Empty/null fields");
            resp.setMessage("Empty/null fields.");
            resp.setStatusCode(500);
            return resp;
        }
        try {
            Appointment appointment = appointmentRepository.findById(registrationRequest.getAppointmentId())
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));

            appointment.setAppointmentState(
                    appointmentStateRepository.findByAppointmentStateId(3)); // hard coded the state id to 3

            Appointment updatedAppointmentResult = appointmentRepository.save(appointment);

            if (updatedAppointmentResult.getAppointmentId() != null) {
                // If the save was successful, populate the response DTO
                resp.setAppointmentId(updatedAppointmentResult.getAppointmentId());
                resp.setAppointmentDoctorEmail(updatedAppointmentResult.getAppointmentDoctor().getUser().getEmail());
                resp.setAppointmentPatientAMKA(updatedAppointmentResult.getAppointmentPatient().getPatient_AMKA());
                resp.setAppointmentDate(updatedAppointmentResult.getAppointmentDate());
                resp.setAppointmentStartTime(updatedAppointmentResult.getAppointmentStartTime());
                resp.setAppointmentEndTime(updatedAppointmentResult.getAppointmentEndTime());
                resp.setAppointmentJustification(updatedAppointmentResult.getAppointmentJustification());
                resp.setAppointmentStateId(updatedAppointmentResult.getAppointmentState().getAppointmentStateId());
                resp.setMessage("Appointment successfully canceled.");
                resp.setStatusCode(200);
            } else {
                log.error("Failed to canceled appointment with id {}", updatedAppointmentResult.getAppointmentId());
                resp.setMessage("Failed to canceled appointment with id: " + updatedAppointmentResult.getAppointmentId());
                resp.setStatusCode(500);
            }
        } catch (Exception e) {
            log.error("Error in cancelling appointment: {}", e.getMessage());
            e.printStackTrace();
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    /* Here a user can request an appointment given the ID of that.
    *  In case the request comes from a Patient the request must be verified,
    *  to see if the appointment belongs to him. Doctor and Secretary can see everything.
    *  We can take the role from the token.*/
    public AppointmentDTO displayAppointmentById(AppointmentDTO registrationRequest) {
        AppointmentDTO resp = new AppointmentDTO();
        try {
            /* Must access the token */
            String jwtToken = getToken();
            if (jwtToken == null) {
                log.error("Empty/null token");
                resp.setMessage("Empty/null token.");
                resp.setStatusCode(500);
                return resp;
            }
            /* At first check id the appointment exists */
            Appointment appointment = appointmentRepository.findById(registrationRequest.getAppointmentId())
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));

            if (jwtUtils.extractRole(jwtToken).equals("USER_PATIENT")) {
                log.info("The role is USER_PATIENT, must check the permission for the appointment {}", registrationRequest.getAppointmentId());
                /* Get from the appointment the patient email (appointmentPatientAMKA)
                *  and compare it with the email of the user that has the token in the request. */
                if(Objects.equals(appointment.getAppointmentPatient().getUser().getEmail()
                        , jwtUtils.extractUsername(jwtToken))) {
                    resp.setAppointmentId(appointment.getAppointmentId());
                    resp.setAppointmentDoctorEmail(appointment.getAppointmentDoctor().getUser().getEmail());
                    resp.setAppointmentPatientAMKA(appointment.getAppointmentPatient().getPatient_AMKA());
                    resp.setAppointmentDate(appointment.getAppointmentDate());
                    resp.setAppointmentStartTime(appointment.getAppointmentStartTime());
                    resp.setAppointmentEndTime(appointment.getAppointmentEndTime());
                    resp.setAppointmentJustification(appointment.getAppointmentJustification());
                    resp.setAppointmentStateId(appointment.getAppointmentState().getAppointmentStateId());
                    resp.setMessage("Appointment successfully found.");
                    resp.setStatusCode(200);
                } else {
                    log.error("Failed to display appointment with id: "
                            +  appointment.getAppointmentId() + ", because the user with username: "
                            +  jwtUtils.extractUsername(jwtToken) + " dont have the permission to view it, "
                            +  " the role is: " + jwtUtils.extractRole(jwtToken) + ".");
                    resp.setMessage("Failed to display appointment with id: "
                            +  appointment.getAppointmentId() + ", because the user with username: "
                            +  jwtUtils.extractUsername(jwtToken) + " dont have the permission to view it, "
                            +  " the role is: " + jwtUtils.extractRole(jwtToken) + ".");
                    resp.setStatusCode(500);
                }
            } else { // the role is secretary and doctor, we don't need to make any permission check
                resp.setAppointmentId(appointment.getAppointmentId());
                resp.setAppointmentDoctorEmail(appointment.getAppointmentDoctor().getUser().getEmail());
                resp.setAppointmentPatientAMKA(appointment.getAppointmentPatient().getPatient_AMKA());
                resp.setAppointmentDate(appointment.getAppointmentDate());
                resp.setAppointmentStartTime(appointment.getAppointmentStartTime());
                resp.setAppointmentEndTime(appointment.getAppointmentEndTime());
                resp.setAppointmentJustification(appointment.getAppointmentJustification());
                resp.setAppointmentStateId(appointment.getAppointmentState().getAppointmentStateId());
                resp.setMessage("Appointment successfully found.");
                resp.setStatusCode(200);
            }
        } catch (Exception e) {
            log.error("Error in displaying appointment: {}", e.getMessage());
            e.printStackTrace();
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }


    /*------------------------------------------------------------------------------------------------------------------------------------------------*/
    private String getToken() {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String authorizationHeader = request.getHeader("Authorization");
        String jwtToken = null;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwtToken = authorizationHeader.substring(7);
            return jwtToken;
        }
        return null;
    }
}
