package com.levantis.clinicManagement.controller;

import com.levantis.clinicManagement.dto.PatientHistoryDTO;
import com.levantis.clinicManagement.dto.UserDTO;
import com.levantis.clinicManagement.entity.PatientHistoryRegistration;
import com.levantis.clinicManagement.service.PatientHistoryManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/history-patient-mangt")
public class PatientHistoryManagementController {

    @Autowired
    private PatientHistoryManagementService patientHistoryManagementService;

    @PostMapping("/create")
    public ResponseEntity<PatientHistoryDTO> createPatientHistory(@RequestBody PatientHistoryDTO patientHistoryDTO) {
        return ResponseEntity.ok(patientHistoryManagementService.createPatientHistory(patientHistoryDTO));
    }

    @PutMapping("/update")
    public ResponseEntity<PatientHistoryDTO> updatePatientHistory(@RequestBody PatientHistoryDTO patientHistoryDTO) {
        return ResponseEntity.ok(patientHistoryManagementService.updateHistory(patientHistoryDTO));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<PatientHistoryDTO> deletePatientHistory(@RequestParam Integer patientHistoryRegistrationId) {
        PatientHistoryDTO patientHistoryDTO = new PatientHistoryDTO();
        patientHistoryDTO.setPatientHistoryRegistrationId(patientHistoryRegistrationId);
        return ResponseEntity.ok(patientHistoryManagementService.deleteHistory(patientHistoryDTO));
    }

    @GetMapping("/displayAllHistory")
    public ResponseEntity<PatientHistoryDTO> displayAllHistory(@RequestParam Integer patientId) {
        PatientHistoryDTO patientHistoryDTO = new PatientHistoryDTO();
        patientHistoryDTO.setPatientId(patientId);
        return ResponseEntity.ok(patientHistoryManagementService.displayAllHistoryOfPatient(patientHistoryDTO));
    }

    @GetMapping("/displayRegistration")
    public ResponseEntity<PatientHistoryDTO> displayRegistration(@RequestParam Integer patientHistoryRegistrationId) {
        PatientHistoryDTO patientHistoryDTO = new PatientHistoryDTO();
        patientHistoryDTO.setPatientHistoryRegistrationId(patientHistoryRegistrationId);
        return ResponseEntity.ok(patientHistoryManagementService.displayHistoryRegistrationInfo(patientHistoryDTO));
    }

    @GetMapping("/searchRegistration")
    public ResponseEntity<PatientHistoryDTO> searchRegistration(@RequestParam String patientID,
                                                                @RequestParam String healthProblemCriteria,
                                                                @RequestParam String startDate,
                                                                @RequestParam String endDate) {

        PatientHistoryDTO patientHistoryDTO = new PatientHistoryDTO();
        if(!endDate.isEmpty() && !startDate.isEmpty()) {
            /* To make things easy for the user, the user can add in the request the format YYYY-MM-DD (LocalDate)
             *  But then the system must convert this to LocalDateTime, we don't care about the time, only for the
             *  Date, so we add a dummy time (atStartOfTheDay). */
            LocalDate startDateLocalDate = LocalDate.parse(startDate);
            LocalDate endDateLocalDate = LocalDate.parse(endDate);

            patientHistoryDTO.setEndDateCriteria(endDateLocalDate.atStartOfDay());
            patientHistoryDTO.setStartDateCriteria(startDateLocalDate.atStartOfDay());
        }
        patientHistoryDTO.setHealthProblemCriteria(healthProblemCriteria);
        patientHistoryDTO.setPatientId(Integer.valueOf(patientID));
        return ResponseEntity.ok(patientHistoryManagementService.searchHistory(patientHistoryDTO));
    }

    @GetMapping("/getLastRegistrationOfPatient")
    public ResponseEntity<PatientHistoryDTO> getLastRegistrationOfPatient(@RequestParam Integer patientId) {
        PatientHistoryDTO patientHistoryDTO = new PatientHistoryDTO();
        patientHistoryDTO.setPatientId(patientId);
        return ResponseEntity.ok(patientHistoryManagementService.getPatientHistoryById(patientHistoryDTO));
    }

}
