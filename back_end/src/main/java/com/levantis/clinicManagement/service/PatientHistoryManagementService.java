package com.levantis.clinicManagement.service;

import com.levantis.clinicManagement.dto.PatientHistoryDTO;
import com.levantis.clinicManagement.entity.Patient;
import com.levantis.clinicManagement.entity.PatientHistory;
import com.levantis.clinicManagement.entity.PatientHistoryRegistration;
import com.levantis.clinicManagement.repository.PatientHistoryRegistrationRepository;
import com.levantis.clinicManagement.repository.PatientHistoryRepository;
import com.levantis.clinicManagement.repository.PatientRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;

@Service
public class PatientHistoryManagementService {

    private static final Logger log = LoggerFactory.getLogger(AppointmentManagementService.class);

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PatientRepository patientRepository;
    @Autowired
    private PatientHistoryRegistrationRepository patientHistoryRegistrationRepository;
    @Autowired
    private PatientHistoryRepository patientHistoryRepository;
    @Autowired
    private PatientHistoryRegistrationRepository patientHistoryRegistration;


    /* The request will give the id of the patients, with also the data about the Patient History Registration */
    @Transactional
    public PatientHistoryDTO createPatientHistory(PatientHistoryDTO reguest) {
        PatientHistoryDTO resp = new PatientHistoryDTO();
        /* Must access the token and check for null fields */
        String jwtToken = getToken();
        if (jwtToken == null
                || reguest.getPatientId() == null
                || reguest.getPatientHistoryRegistrationHealthProblems() == null
                || reguest.getPatientHistoryRegistrationTreatment() == null
        ) {
            log.error("Empty/null token");
            resp.setMessage("Empty/null token.");
            resp.setStatusCode(500);
            return resp;
        }

        try {

            /* Only a doctor manage history */
            if(!jwtUtils.extractRole(jwtToken).equals("USER_DOCTOR")) {
                log.error("The user requesting the function create Patient history dont have the permission");
                resp.setMessage("The user requesting the function create Patient history dont have the permission");
                resp.setStatusCode(406);
                return resp;
            }
            Patient patient = patientRepository.findById(reguest.getPatientId())
                    .orElseThrow(() -> new RuntimeException("Patient with ID: " + reguest.getPatientId() + " not found"));

            /* Initialize the Registration, and add the request parameters */
            PatientHistoryRegistration patientHistoryRegistrationNew = new PatientHistoryRegistration();
            PatientHistory temp = patientHistoryRepository.findByPatient(patient.getPatient_id());
            patientHistoryRegistrationNew.setPatientHistoryRegistrationHealthProblems(reguest.getPatientHistoryRegistrationHealthProblems());
            patientHistoryRegistrationNew.setPatientHistoryRegistrationTreatment(reguest.getPatientHistoryRegistrationTreatment());
            patientHistoryRegistrationNew.setPatientHistoryRegistrationDateRegister(LocalDate.now());

            /* We have to check whether the patient has already a history created for them.
            *  If in the past someone tried to create a registration for the first time, automatically
            *  the system will have crated a history for him/her if not present. */
            if(temp == null) {
                log.info("The patient with id: {} does not have a history, proceed to create it...", patient.getPatient_id());
                PatientHistory patientHistoryNew = new PatientHistory();
                patientHistoryRegistrationNew.setPatientHistory(patientHistoryNew);
                patientHistoryNew.setPatient(patient);
                ArrayList<PatientHistoryRegistration> list = new ArrayList<>();
                list.add(patientHistoryRegistrationNew);
                patientHistoryNew.setPatientHistoryRegistrations(list);
                // here might throw error if the patient has already a history
                PatientHistory patientHistoryResult = patientHistoryRepository.save(patientHistoryNew);
                log.info("History for patient: {} has been created with success: {}", patient.getPatient_id(), patientHistoryResult);
            } else {
                log.info("The patient with id: {} has a history: {}", patient.getPatient_id(), temp.getHistoryId());
                patientHistoryRegistrationNew.setPatientHistory(temp);
            }
            PatientHistoryRegistration patientHistoryRegistrationResult = patientHistoryRegistrationRepository.save(patientHistoryRegistrationNew);

            resp.setMessage("The registration has been done with success, NOTE: " + (temp == null ? "HISTORY CREATION YES" : "HISTORY CREATION NO"));
            resp.setStatusCode(200);
        } catch (Exception e) {
            String exceptionType = e.getClass().getSimpleName();
            e.printStackTrace();
            log.error("{}: {}", e.getMessage(), exceptionType);
            resp.setMessage(exceptionType + ": " + e.getMessage());
            resp.setStatusCode(500);
        }
        return resp;
    }

    /* The request must have the registration ID, the updated health problems and the updated treatment */
    public PatientHistoryDTO updateHistory(PatientHistoryDTO reguest) {
        PatientHistoryDTO resp = new PatientHistoryDTO();
        /* Must access the token and check for null fields */
        String jwtToken = getToken();
        if (jwtToken == null
                || reguest.getPatientHistoryRegistrationId() == null
                || reguest.getPatientHistoryRegistrationHealthProblems() == null
                || reguest.getPatientHistoryRegistrationTreatment() == null
        ) {
            log.error("Empty/null token");
            resp.setMessage("Empty/null token.");
            resp.setStatusCode(500);
            return resp;
        }

        try {
            if(!jwtUtils.extractRole(jwtToken).equals("USER_DOCTOR")) {
                log.error("The user requesting the function update Patient history dont have the permission");
                resp.setMessage("The user requesting the function update Patient history dont have the permission");
                resp.setStatusCode(406);
                return resp;
            }

            /* Based on the registration ID in the request find the actual object, if not throw an exception */
            PatientHistoryRegistration patientHistoryRegistration = patientHistoryRegistrationRepository.findById(reguest.getPatientHistoryRegistrationId())
                    .orElseThrow(() -> new RuntimeException("The registration with ID: " + reguest.getPatientHistoryRegistrationId() + " cannot be found."));

            if(reguest.getPatientHistoryRegistrationHealthProblems() != null && !reguest.getPatientHistoryRegistrationHealthProblems().isEmpty()) {
                patientHistoryRegistration.setPatientHistoryRegistrationHealthProblems(reguest.getPatientHistoryRegistrationHealthProblems());
            }
            if(reguest.getPatientHistoryRegistrationTreatment() != null && !reguest.getPatientHistoryRegistrationTreatment().isEmpty()) {
                patientHistoryRegistration.setPatientHistoryRegistrationTreatment(reguest.getPatientHistoryRegistrationTreatment());
            }

            PatientHistoryRegistration patientHistoryRegistrationResult = patientHistoryRegistrationRepository.save(patientHistoryRegistration);

            resp.setMessage("The registration update has been done with success.");
            resp.setStatusCode(200);
        } catch (Exception e) {
            String exceptionType = e.getClass().getSimpleName();
            e.printStackTrace();
            log.error("{}: {}", e.getMessage(), exceptionType);
            resp.setMessage(exceptionType + ": " + e.getMessage());
            resp.setStatusCode(500);
        }
        return resp;
    }

    public PatientHistoryDTO deleteHistory(PatientHistoryDTO reguest) {
        PatientHistoryDTO resp = new PatientHistoryDTO();
        /* Must access the token and check for null fields */
        String jwtToken = getToken();
        if (jwtToken == null
                || reguest.getPatientHistoryRegistrationId() == null
        ) {
            log.error("Empty/null token");
            resp.setMessage("Empty/null token.");
            resp.setStatusCode(500);
            return resp;
        }

        try {
            if(!jwtUtils.extractRole(jwtToken).equals("USER_DOCTOR")) {
                log.error("The user requesting the function delete Patient history dont have the permission");
                resp.setMessage("The user requesting the function delete Patient history dont have the permission");
                resp.setStatusCode(406);
                return resp;
            }

            /* Based on the registration ID in the request find the actual object, if not throw an exception */
            PatientHistoryRegistration patientHistoryRegistration = patientHistoryRegistrationRepository.findById(reguest.getPatientHistoryRegistrationId())
                    .orElseThrow(() -> new RuntimeException("The registration with ID: " + reguest.getPatientHistoryRegistrationId() + " cannot be found."));

            patientHistoryRegistrationRepository.delete(patientHistoryRegistration);

            resp.setMessage("The registration deletion has been done with success.");
            resp.setStatusCode(200);
        } catch (Exception e) {
            String exceptionType = e.getClass().getSimpleName();
            e.printStackTrace();
            log.error("{}: {}", e.getMessage(), exceptionType);
            resp.setMessage(exceptionType + ": " + e.getMessage());
            resp.setStatusCode(500);
        }
        return resp;
    }






    /* ------------------------------------------------------------------------------------------------------------------ */

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
