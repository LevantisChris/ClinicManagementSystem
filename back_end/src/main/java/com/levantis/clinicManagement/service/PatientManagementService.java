package com.levantis.clinicManagement.service;

import com.levantis.clinicManagement.dto.PatientDTO;
import com.levantis.clinicManagement.dto.UserDTO;
import com.levantis.clinicManagement.entity.*;
import com.levantis.clinicManagement.repository.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.sql.Date;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientManagementService {

    private static final Logger log = LoggerFactory.getLogger(PatientManagementService.class);

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private JwtUtils jwtUtils;
    @Autowired
    private AuthenticationManager  authenticationManager;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private DoctorSpecialityRepository doctorSpecialityRepository;
    @Autowired
    private DoctorRepository doctorRepository;

    @Transactional
    public UserDTO createPatient(UserDTO registrationRequest) {
        log.info("Creating new patient");
        UserDTO resp = new UserDTO();

        String jwtToken = getToken();
        if (jwtToken == null) {
            log.error("Empty/null token");
            resp.setMessage("Empty/null token.");
            resp.setStatusCode(500);
            return resp;
        } else if(jwtUtils.extractRole(jwtToken).equals("USER_PATIENT")) {
            log.error("The user requesting the function create patient dont have the permission.");
            resp.setMessage("The user requesting the function create patient dont have the permission.");
            resp.setStatusCode(405);
            return resp;
        }

        if(registrationRequest.getUserName() == null || registrationRequest.getUserName().isEmpty()
                || registrationRequest.getUserSurname() == null || registrationRequest.getUserSurname().isEmpty()
                || registrationRequest.getUserIdNumber() == null || registrationRequest.getUserIdNumber().isEmpty()
                || registrationRequest.getUserPassword() == null || registrationRequest.getUserPassword().isEmpty()
                || registrationRequest.getUserEmail() == null || registrationRequest.getUserEmail().isEmpty()) {
            log.error("Empty/null fields");
            resp.setMessage("Empty/null fields.");
            resp.setStatusCode(500);
            return resp;
        }
        try {
            if(registrationRequest.getRoleId() == 1) {
                User user = new User();
                user.setUser_name(registrationRequest.getUserName());
                user.setUser_surname(registrationRequest.getUserSurname());
                user.setUser_idNumber(registrationRequest.getUserIdNumber());
                user.setEmail(registrationRequest.getUserEmail());
                user.setUser_password(passwordEncoder.encode(registrationRequest.getUserPassword()));

                Role role = roleRepository.findById(registrationRequest.getRoleId())
                        .orElseThrow(() -> new RuntimeException("Role not found"));
                user.setRole(role);
                user.setRole_str(role.getRole_description());

                var jwt = jwtUtils.generateToken(user);
                var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);
                resp.setToken(jwt);

                User userResult = userRepository.save(user);

                if (userResult.getUser_id() > 0) {
                    log.info("User registered successfully, email: {}", registrationRequest.getUserEmail() + ", continuing with updating the patient table.");
                    // Continue with updating the Patient table
                    Patient patient = new Patient();
                    patient.setUser(user);
                    patient.setPatient_AMKA(registrationRequest.getPatientAMKA());
                    patient.setPatientRegistrationDate(Date.valueOf(LocalDate.now()));
                    Patient patientResult = patientRepository.save(patient);
                    if (patientResult.getPatient_id() > 0) {
                        log.info("Patient registered successfully, email: {}", registrationRequest.getUserEmail());
                        resp.setUsers(userResult);
                        resp.setMessage("User registered successfully");
                        resp.setStatusCode(200);
                    } else
                        throw new Exception();
                }
            } else {
                log.error("Trying to add a patient bad given wrong role ID, operation cancelled.");
                resp.setMessage("Trying to add a patient bad given wrong role ID, operation cancelled.");
                resp.setStatusCode(500);
                return resp;
            }
        } catch (Exception e) {
            log.error("Error registering user", e);
            e.printStackTrace();
            resp.setStatusCode(500);
            resp.setError("Error occurred registering the patient.");
        }
        return resp;
    }

    public PatientDTO deletePatient(PatientDTO patientDTO) {
        PatientDTO resp = new PatientDTO();
        try {
            String jwtToken = getToken();
            if (jwtToken == null || patientDTO.getPatientId() == null) {
                log.error("Empty/null token");
                resp.setMessage("Empty/null token.");
                resp.setStatusCode(500);
                return resp;
            } else if(jwtUtils.extractRole(jwtToken).equals("USER_PATIENT")) {
                log.error("The user requesting the function delete patient dont have the permission.");
                resp.setMessage("The user requesting the function delete patient dont have the permission.");
                resp.setStatusCode(405);
                return resp;
            }
            /* At first, we have to find the patient based on the provided ID, and then delete him */
            Patient patientToDelete = patientRepository.findById(patientDTO.getPatientId())
                    .orElseThrow(() -> new RuntimeException("Patient not found"));

            userRepository.delete(patientToDelete.getUser());
            userRepository.flush();
            resp.setMessage("Patient successfully deleted.");
            resp.setStatusCode(200);
        } catch (RuntimeException e) {
            log.error(e.getMessage());
            resp.setMessage(e.getMessage());
            resp.setStatusCode(404);
        } catch (Exception e) {
            log.error("Error deleting patient: ", e);
            resp.setMessage("An error occurred while deleting the patient: " + e.getMessage());
            resp.setStatusCode(500);
        }

        return resp;
    }

    public List<PatientDTO> searchPatient(PatientDTO patientDTO) {
        log.info("Searching for patient");
        PatientDTO resp = new PatientDTO();

        try {
            String jwtToken = getToken();
            if (jwtToken == null || patientDTO.getPatientAMKA() == null || patientDTO.getPatientUser().getUser_surname() == null) {
                log.error("Empty/null token or fields.");
                resp.setMessage("Empty/null token.");
                resp.setStatusCode(500);
                return List.of(resp);
            } else if (jwtUtils.extractRole(jwtToken).equals("USER_PATIENT")) {
                log.error("The user requesting the function search a patient, dont have the permission.");
                resp.setMessage("The user requesting the function search a patient, dont have the permission.");
                resp.setStatusCode(405);
                return List.of(resp);
            }
            /* See if the user requesting is patient or not. Patient cannot access this function */
            if(jwtUtils.extractRole(jwtToken).equals("USER_PATIENT")) {
                log.error("A patient is requesting the function search patients, cannot access it.");
                resp.setMessage("A patient is requesting the function search patients, cannot access it.");
                resp.setStatusCode(405);
                return List.of(resp);
            }

            /* If every parameter is empty return all the patients */
            List<Patient> patients = null;
            if(patientDTO.getPatientAMKA().isEmpty() && patientDTO.getPatientUser().getUser_surname().isEmpty()) {
                log.info("Empty/null fields, so returning the last 20 patients");
                patients = patientRepository.findAll();

            } else if(!patientDTO.getPatientAMKA().isEmpty() && !patientDTO.getPatientUser().getUser_surname().isEmpty()) {
                System.out.println("NONE IS EMPTY: " + patientDTO.getPatientUser().getUser_surname() + ", " + patientDTO.getPatientAMKA());
                patients = patientRepository.findByPatient_AMKAAndUser(patientDTO.getPatientUser().getUser_surname(), patientDTO.getPatientAMKA());

            } else if(patientDTO.getPatientAMKA().isEmpty() && !patientDTO.getPatientUser().getUser_surname().isEmpty()) {
                System.out.println("The AMKA is empty, " + patientDTO.getPatientUser().getUser_surname());
                patients = patientRepository.findByPatientUser_List(patientDTO.getPatientUser().getUser_surname());

            } else {
                System.out.println("The surname is empty, " + patientDTO.getPatientAMKA());
                patients = patientRepository.findByPatient_AMKA_list(patientDTO.getPatientAMKA());

            }
            if (patients == null || patients.isEmpty()) {
                log.warn("No patients found (findAll).");
                resp.setMessage("No patients found (findAll).");
                resp.setStatusCode(404);
                return List.of(resp);
            } else {
                log.info("Successful search, patients found (findAll).");
                return patients.stream().map(patient -> {
                    PatientDTO dto = new PatientDTO();
                    dto.setPatientId(patient.getPatient_id());
                    dto.setPatientRegistrationDate(patient.getPatientRegistrationDate());
                    dto.setPatientAMKA(patient.getPatient_AMKA());
                    dto.setPatientUser(patient.getUser());
                    dto.setStatusCode(200);
                    dto.setMessage("Successful search, patients found (findAll).");
                    return dto;
                }).collect(Collectors.toList());

            }
        } catch (Exception e) {
            log.error("Error searching patient", e);
            e.printStackTrace();
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return List.of(resp);
    }

    public PatientDTO displayPatientById(PatientDTO patientDTO) {
        PatientDTO resp = new PatientDTO();
        try {
            String jwtToken = getToken();
            if (jwtToken == null || patientDTO.getPatientId() == null) {
                log.error("Empty/null token or fields.");
                resp.setMessage("Empty/null token.");
                resp.setStatusCode(500);
                return resp;
            }
            Patient patient = patientRepository.findById(patientDTO.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient with ID: " + patientDTO.getPatientId() + " don't exist."));

            resp.setPatientId(patient.getPatient_id());
            resp.setPatientAMKA(patient.getPatient_AMKA());
            resp.setPatientRegistrationDate(patient.getPatientRegistrationDate());
            resp.setPatientUser(patient.getUser());
            resp.setStatusCode(200);
            resp.setMessage("Successful display patient.");
        } catch (Exception e) {
            log.error("Error displaying patient", e);
            e.printStackTrace();
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    /* The ID is patient ID */
    public PatientDTO updatePatientById(PatientDTO updateRequest) {
        PatientDTO resp = new PatientDTO();
        try {
            Patient patientNew = null;
            User patientUser = null;

            String jwtToken = getToken();
            if (jwtToken == null || updateRequest.getPatientId() == null) {
                log.error("Empty/null token or fields.");
                resp.setMessage("Empty/null token.");
                resp.setStatusCode(500);
                return resp;
            }
            if(jwtUtils.extractRole(jwtToken).equals("USER_PATIENT")) {
                /* The update must be done in the info about him */
                /* At first we need to find the user with that the patient requesting represents */
                patientUser = userRepository.findByEmail(jwtUtils.extractUsername(jwtToken))
                        .orElseThrow(() -> new RuntimeException("User (in update patient) with email: " + jwtToken + " don't exist."));
                /* Now return the patient object */
                patientNew = patientRepository.findByPatientUser(patientUser.getUser_surname());
            } else {
                patientNew = patientRepository.findById(updateRequest.getPatientId())
                        .orElseThrow(() -> new RuntimeException("Patient with ID: " + updateRequest.getPatientId() + " don't exist."));
            }

            if(patientNew != null) {
                /* Update the fields */
                if(!updateRequest.getPatientName().isEmpty()) {
                    patientNew.getUser().setUser_name(updateRequest.getPatientName());
                }
                if(!updateRequest.getPatientSurname().isEmpty()) {
                    patientNew.getUser().setUser_surname(updateRequest.getPatientSurname());
                }
                if(!updateRequest.getPatientEmail().isEmpty()) {
                    patientNew.getUser().setEmail(updateRequest.getPatientEmail());
                }
                if(updateRequest.getPatientId() == null) {
                    patientNew.getUser().setUser_idNumber(updateRequest.getPatientIdNumber());
                }
                if(!updateRequest.getPatientAMKA().isEmpty()) {
                    patientNew.setPatient_AMKA(updateRequest.getPatientAMKA());
                }

                Patient patientResult = patientRepository.save(patientNew);

                if (patientResult.getPatient_id() > 0) {
                    resp.setPatientId(patientNew.getPatient_id());
                    resp.setPatientAMKA(patientNew.getPatient_AMKA());
                    resp.setPatientRegistrationDate(patientNew.getPatientRegistrationDate());
                    resp.setPatientUser(patientNew.getUser());
                    resp.setStatusCode(200);
                    resp.setMessage("Successful update patient.");
                } else {
                    log.error("Error updating patient.");
                    resp.setStatusCode(500);
                    resp.setError("Error updating patient.");
                }
            } else {
                log.error("Error updating patient.");
                resp.setStatusCode(500);
                resp.setError("Error updating patient.");
            }
        } catch (Exception e) {
            log.error("Error updating patient, ", e);
            e.printStackTrace();
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }


    /*--------------------------------------------------------------------------------------------------------------------*/
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
