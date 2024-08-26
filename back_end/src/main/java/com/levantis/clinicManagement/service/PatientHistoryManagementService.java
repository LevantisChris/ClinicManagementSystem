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
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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
    public PatientHistoryDTO createPatientHistory(PatientHistoryDTO request) {
        PatientHistoryDTO resp = new PatientHistoryDTO();
        /* Must access the token and check for null fields */
        String jwtToken = getToken();
        if (jwtToken == null
                || request.getPatientId() == null
                || request.getPatientHistoryRegistrationHealthProblems() == null
                || request.getPatientHistoryRegistrationTreatment() == null
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
            Patient patient = patientRepository.findById(request.getPatientId())
                    .orElseThrow(() -> new RuntimeException("Patient with ID: " + request.getPatientId() + " not found"));

            /* Initialize the Registration, and add the request parameters */
            PatientHistoryRegistration patientHistoryRegistrationNew = new PatientHistoryRegistration();
            PatientHistory temp = patientHistoryRepository.findByPatient(patient.getPatient_id());
            patientHistoryRegistrationNew.setPatientHistoryRegistrationHealthProblems(request.getPatientHistoryRegistrationHealthProblems());
            patientHistoryRegistrationNew.setPatientHistoryRegistrationTreatment(request.getPatientHistoryRegistrationTreatment());
            patientHistoryRegistrationNew.setPatientHistoryRegistrationDateRegister(LocalDateTime.now());

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
    public PatientHistoryDTO updateHistory(PatientHistoryDTO request) {
        PatientHistoryDTO resp = new PatientHistoryDTO();
        /* Must access the token and check for null fields */
        String jwtToken = getToken();
        if (jwtToken == null
                || request.getPatientHistoryRegistrationId() == null
                || request.getPatientHistoryRegistrationHealthProblems() == null
                || request.getPatientHistoryRegistrationTreatment() == null
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
            PatientHistoryRegistration patientHistoryRegistration = patientHistoryRegistrationRepository.findById(request.getPatientHistoryRegistrationId())
                    .orElseThrow(() -> new RuntimeException("The registration with ID: " + request.getPatientHistoryRegistrationId() + " cannot be found."));

            if(request.getPatientHistoryRegistrationHealthProblems() != null && !request.getPatientHistoryRegistrationHealthProblems().isEmpty()) {
                patientHistoryRegistration.setPatientHistoryRegistrationHealthProblems(request.getPatientHistoryRegistrationHealthProblems());
            }
            if(request.getPatientHistoryRegistrationTreatment() != null && !request.getPatientHistoryRegistrationTreatment().isEmpty()) {
                patientHistoryRegistration.setPatientHistoryRegistrationTreatment(request.getPatientHistoryRegistrationTreatment());
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

    public PatientHistoryDTO deleteHistory(PatientHistoryDTO request) {
        PatientHistoryDTO resp = new PatientHistoryDTO();
        /* Must access the token and check for null fields */
        String jwtToken = getToken();
        if (jwtToken == null
                || request.getPatientHistoryRegistrationId() == null
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
            PatientHistoryRegistration patientHistoryRegistration = patientHistoryRegistrationRepository.findById(request.getPatientHistoryRegistrationId())
                    .orElseThrow(() -> new RuntimeException("The registration with ID: " + request.getPatientHistoryRegistrationId() + " cannot be found."));

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

    /* Based on the patient-ID we give back all the history registrations for him/her, in descending time order */
    public PatientHistoryDTO displayAllHistoryOfPatient(PatientHistoryDTO request) {
        PatientHistoryDTO resp = new PatientHistoryDTO();
        /* Must access the token and check for null fields */
        String jwtToken = getToken();
        if (jwtToken == null || request.getPatientId() == null) {
            log.error("Empty/null token");
            resp.setMessage("Empty/null token.");
            resp.setStatusCode(500);
            return resp;
        }

        try {
            Patient patient;
            if(jwtUtils.extractRole(jwtToken).equals("USER_PATIENT")) {
                log.info("The use requesting the function display all the registrations history is PATIENT");
                /* If the user requesting is a patient, we don't need to use the patient ID
                *  from th request. We use the username (email) from the token */
                String username = jwtUtils.extractUsername(jwtToken);
                patient = patientRepository.findByUser(username); // find by username (email)
            } else if(jwtUtils.extractRole(jwtToken).equals("USER_SECRETARY")) {
                log.error("The user requesting the function display Patient history dont have the permission, is SECRETARY.");
                resp.setMessage("The user requesting the function display Patient history dont have the permission, is SECRETARY.");
                resp.setStatusCode(406);
                return resp;
            } else {
                /* Here is the doctor that will use the request patient ID
                 * At first find the patient */
                patient = patientRepository.findById(request.getPatientId())
                        .orElseThrow(() -> new RuntimeException("Patient with ID: " + request.getPatientId() + " not found"));
            }

            /* Now take all the registrations done for that patient.
             * NOTE: if the user dont have any history at all the list will be empty */
            List<PatientHistoryRegistration> patientHistoryRegistration = patientHistoryRepository.findByPatientId(patient.getPatient_id());
            if(patientHistoryRegistration.isEmpty()) {
                log.error("Not any registrations found, for patient: " + patient.getPatient_id());
                resp.setMessage("Not any registrations found, for patient: " + patient.getPatient_id());
                resp.setStatusCode(500);
                return resp;
            } else {
                resp.setStatusCode(200);
                resp.setMessage("Patient history found.");
                resp.setPatientId(patient.getPatient_id());
                resp.setPatientHistoryRegistrations(patientHistoryRegistration);
            }
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
