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
                patients = patientRepository.findByPatientUser(patientDTO.getPatientUser().getUser_surname());

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
