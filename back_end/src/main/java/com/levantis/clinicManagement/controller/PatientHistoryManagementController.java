package com.levantis.clinicManagement.controller;

import com.levantis.clinicManagement.dto.PatientHistoryDTO;
import com.levantis.clinicManagement.dto.UserDTO;
import com.levantis.clinicManagement.service.PatientHistoryManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/history-patient-mangt")
public class PatientHistoryManagementController {

    @Autowired
    private PatientHistoryManagementService patientHistoryManagementService;

    @PostMapping("/create")
    public ResponseEntity<PatientHistoryDTO> createPatientHistory(@RequestBody PatientHistoryDTO patientHistoryDTO) {
        return ResponseEntity.ok(patientHistoryManagementService.createPatientHistory(patientHistoryDTO));
    }

}
