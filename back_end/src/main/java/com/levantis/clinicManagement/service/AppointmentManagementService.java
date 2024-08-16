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

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

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
        log.info("Define Working Hours");
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

            log.info("JSON Received in defineWorkingHours is: {}" , registrationRequest);

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

    public List<WorkingHoursDTO> getWorkingHoursOfADoctor() {
        WorkingHoursDTO resp = new WorkingHoursDTO();
        try {

            String jwtToken = getToken();
            if (jwtToken == null) {
                log.error("Empty/null token");
                resp.setMessage("Empty/null token.");
                resp.setStatusCode(500);
                return List.of(resp);
            }
            User user = userRepository.findByEmail(jwtUtils.extractUsername(jwtToken))
                    .orElseThrow(() -> new RuntimeException("User (Doctor) Not found"));

            Doctor doctor = user.getDoctor();

            List<WorkingHours> workingHoursList = workingHoursRepository.findByDoctor(doctor);

            if (workingHoursList.isEmpty()) {
                log.warn("No working hours found for doctorId: " + doctor.getDoctor_id());
                resp.setMessage("No working hours found for the specified doctor.");
                resp.setStatusCode(404);
                return List.of(resp);
            } else {
                log.info("Doctor ID extract: " + doctor.getDoctor_id());
                return workingHoursList.stream().map(workingHours -> {
                    WorkingHoursDTO dto = new WorkingHoursDTO();
                    dto.setDoctorId(workingHours.getDoctor().getDoctor_id());
                    dto.setWorkingHoursId(workingHours.getId());
                    dto.setWorkingHoursDate(workingHours.getDate());
                    dto.setStartTime(workingHours.getStartTime());
                    dto.setEndTime(workingHours.getEndTime());
                    dto.setStatusCode(200);
                    dto.setMessage("Working hours retrieved successfully.");
                    return dto;
                }).collect(Collectors.toList());
            }

        } catch (Exception e) {
            log.error("Error in getting the working hours: " + e.getMessage());
            e.printStackTrace();
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
            return List.of(resp);
        }
    }

    /* The user can delete an existing Working Hour statement.
    *  This can be done based on the date and the start and end time.*/
    public WorkingHoursDTO deleteWorkingHours(WorkingHoursDTO registrationRequest) {
        log.info("Delete working hours called");
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
                resp.setAppointmentPatientAMKA(appointmentResult.getAppointmentPatient().getPatient_AMKA());
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

            /* If the request comes from a user with role patient, we must check whether
             *  appointment belongs to him. For the Doctor and the secretary we don't need
             *  to do anything. */
            if (jwtUtils.extractRole(jwtToken).equals("USER_PATIENT")) {
                log.info("The role is USER_PATIENT, must check the permission for the appointment {}", registrationRequest.getAppointmentId());
                if(!Objects.equals(appointment.getAppointmentPatient().getUser().getEmail()
                        , jwtUtils.extractUsername(jwtToken))) {
                    log.error("Failed to update appointment with id: "
                            +  appointment.getAppointmentId() + ", because the user with username: "
                            +  jwtUtils.extractUsername(jwtToken) + " dont have the permission to view it, "
                            +  " the role is: " + jwtUtils.extractRole(jwtToken) + ".");
                    resp.setMessage("Failed to update appointment with id: "
                            +  appointment.getAppointmentId() + ", because the user with username: "
                            +  jwtUtils.extractUsername(jwtToken) + " dont have the permission to view it, "
                            +  " the role is: " + jwtUtils.extractRole(jwtToken) + ".");
                    resp.setStatusCode(500);
                    return resp;
                }
            }

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
        try {

            String jwtToken = getToken();

            if(registrationRequest.getAppointmentId() == null || jwtToken == null) {
                log.error("Empty/null fields");
                resp.setMessage("Empty/null fields.");
                resp.setStatusCode(500);
                return resp;
            }

            Appointment appointment = appointmentRepository.findById(registrationRequest.getAppointmentId())
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));

            /* If the request comes from a user with role patient, we must check whether
            *  appointment belongs to him. For the Doctor and the secretary we don't need
            *  to do anything. */
            if (jwtUtils.extractRole(jwtToken).equals("USER_PATIENT")) {
                log.info("The role is USER_PATIENT, must check the permission for the appointment {}", registrationRequest.getAppointmentId());
                if(!Objects.equals(appointment.getAppointmentPatient().getUser().getEmail()
                        , jwtUtils.extractUsername(jwtToken))) {
                    log.error("Failed to cancel appointment with id: "
                            +  appointment.getAppointmentId() + ", because the user with username: "
                            +  jwtUtils.extractUsername(jwtToken) + " dont have the permission to view it, "
                            +  " the role is: " + jwtUtils.extractRole(jwtToken) + ".");
                    resp.setMessage("Failed to cancel appointment with id: "
                            +  appointment.getAppointmentId() + ", because the user with username: "
                            +  jwtUtils.extractUsername(jwtToken) + " dont have the permission to view it, "
                            +  " the role is: " + jwtUtils.extractRole(jwtToken) + ".");
                    resp.setStatusCode(500);
                    return resp;
                }
            }
            /* If everything goes ok we continue,
            *  here we will be if the role is
            *  patient or doctor. */

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
            if (jwtToken == null || registrationRequest.getAppointmentId() == null) {
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

    /* If the user does not give a date range or a patient's surname or AMKA or
       appointment status, then the pending appointments of the current day will
       be predetermined to him. Otherwise, appointments that meet
       the user's search criteria will be displayed.
       Also, if the role is patient we must check if the patient has the permission
       to view the returned appointments.*/
    public AppointmentDTO searchAppointments(AppointmentDTO searchCriteria) {
        AppointmentDTO resp = new AppointmentDTO();
        List<Appointment> appointments;

        try {
            /* At first get the token, we will use the token to retrieve the
            *  role of the user that make the request */
            String jwtToken = getToken();
            if (jwtToken == null) {
                log.error("Empty/null token");
                resp.setMessage("Empty/null token.");
                resp.setStatusCode(500);
                return resp;
            }

            boolean hasDateRange = searchCriteria.getStartDate() != null && searchCriteria.getEndDate() != null;
            boolean hasPatientSurname = searchCriteria.getPatientSurname() != null;
            boolean hasPatientAMKA = searchCriteria.getAppointmentPatientAMKA() != null;
            boolean hasAppointmentStatus = searchCriteria.getAppointmentStateId() != null;

            String status_description = "Created";

            if (!hasDateRange && !hasPatientSurname && !hasPatientAMKA && !hasAppointmentStatus) {
                Date today = new Date();
                appointments = appointmentRepository.findByAppointmentDateAndAppointmentState(today, status_description);
            } else if (hasAppointmentStatus) {
                appointments = appointmentRepository.findByAppointmentState(searchCriteria.getAppointmentStateId());
            } else if (hasDateRange && hasPatientSurname) {
                appointments = appointmentRepository.findByDateRangeAndPatientSurnameAndAppointmentState(
                        searchCriteria.getStartDate(), searchCriteria.getEndDate(), searchCriteria.getPatientSurname(), status_description);
            } else if (hasDateRange && hasPatientAMKA) {
                appointments = appointmentRepository.findByDateRangeAndPatientAMKAAndAppointmentState(
                        searchCriteria.getStartDate(), searchCriteria.getEndDate(), searchCriteria.getAppointmentPatientAMKA(), status_description);
            } else if (hasDateRange) {
                appointments = appointmentRepository.findByAppointmentDateBetweenAndAppointmentState(
                        searchCriteria.getStartDate(), searchCriteria.getEndDate(), status_description);
            } else if (hasPatientSurname) {
                appointments = appointmentRepository.findByPatientSurnameAndAppointmentState(
                        searchCriteria.getPatientSurname(), status_description);
            } else if (hasPatientAMKA) {
                appointments = appointmentRepository.findByPatientAMKAAndAppointmentState(
                        searchCriteria.getAppointmentPatientAMKA(), status_description);
            } else {
                appointments = new ArrayList<>();
            }

            /* Filter the results in case the user is patient, only the one
            *  that belong to him must be returned. */
            /* Check if the role is patient */
            if (jwtUtils.extractRole(jwtToken).equals("USER_PATIENT")) {
                List<Appointment> appointmentsPatient = new ArrayList<>();
                log.info("The role is USER_PATIENT, must check the permission for the appointment");
                for(int i = 0;i < appointments.size();i++) {
                    /* If true the previously returned appointment belong to him */
                    if(appointments.get(i).getAppointmentPatient().getUser().getEmail()
                            .equals(jwtUtils.extractUsername(jwtToken))) {
                        appointmentsPatient.add(appointments.get(i));
                    }
                }
                appointments = appointmentsPatient;
            }

            if (!appointments.isEmpty()) {
                resp.setAppointmentList(appointments.stream().map(this::mapToAppointmentDTO).collect(Collectors.toList()));
                resp.setMessage("Appointments retrieved successfully.");
                resp.setStatusCode(200);
            } else {
                resp.setMessage("No appointments found.");
                resp.setStatusCode(404);
            }
        } catch (Exception e) {
            log.error("Error searching appointments: {}", e.getMessage());
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    /*------------------------------------------------------------------------------------------------------------------------------------------------*/

    private AppointmentDTO mapToAppointmentDTO(Appointment appointment) {
        AppointmentDTO dto = new AppointmentDTO();
        dto.setAppointmentId(appointment.getAppointmentId());
        dto.setAppointmentDoctorEmail(appointment.getAppointmentDoctor().getUser().getEmail());
        dto.setAppointmentPatientAMKA(appointment.getAppointmentPatient().getPatient_AMKA());
        dto.setAppointmentDate(appointment.getAppointmentDate());
        dto.setAppointmentStartTime(appointment.getAppointmentStartTime());
        dto.setAppointmentEndTime(appointment.getAppointmentEndTime());
        dto.setAppointmentJustification(appointment.getAppointmentJustification());
        dto.setAppointmentCreationDate(appointment.getAppointmentCreationDate());
        dto.setAppointmentStateId(appointment.getAppointmentState().getAppointmentStateId());
        return dto;
    }

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
