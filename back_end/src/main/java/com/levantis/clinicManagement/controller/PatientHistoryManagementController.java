package com.levantis.clinicManagement.controller;

import com.levantis.clinicManagement.dto.PatientHistoryDTO;
import com.levantis.clinicManagement.dto.UserDTO;
import com.levantis.clinicManagement.entity.PatientHistoryRegistration;
import com.levantis.clinicManagement.service.PatientHistoryManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<PatientHistoryDTO> updatePatientHistory(
            @RequestParam Integer patientHistoryRegistrationId,
            @RequestParam String patientHistoryRegistrationHealthProblems,
            @RequestParam String patientHistoryRegistrationTreatment) {
        PatientHistoryDTO patientHistoryDTO = new PatientHistoryDTO();
        patientHistoryDTO.setPatientHistoryRegistrationId(patientHistoryRegistrationId);
        patientHistoryDTO.setPatientHistoryRegistrationHealthProblems(patientHistoryRegistrationHealthProblems);
        patientHistoryDTO.setPatientHistoryRegistrationTreatment(patientHistoryRegistrationTreatment);
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

}
