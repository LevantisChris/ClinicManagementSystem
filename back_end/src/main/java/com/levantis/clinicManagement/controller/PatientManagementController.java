package com.levantis.clinicManagement.controller;

import com.levantis.clinicManagement.dto.PatientDTO;
import com.levantis.clinicManagement.dto.UserDTO;
import com.levantis.clinicManagement.entity.User;
import com.levantis.clinicManagement.service.PatientManagementService;
import jakarta.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patient-mangt")
public class PatientManagementController {

    @Autowired
    private PatientManagementService patientManagementService;

    @PostMapping("/create")
    public ResponseEntity<UserDTO> createPatient(@RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(patientManagementService.createPatient(userDTO));
    }

    @GetMapping("/search")
    public ResponseEntity<List<PatientDTO>> searchPatient(@RequestParam String AMKA, @RequestParam String surname) {
        PatientDTO patientDTO = new PatientDTO();
        patientDTO.setPatientAMKA(AMKA);
        patientDTO.setPatientUser(new User());
        patientDTO.getPatientUser().setUser_surname(surname);
        return ResponseEntity.ok(patientManagementService.searchPatient(patientDTO));
    }

    @GetMapping("/searchById")
    public ResponseEntity<PatientDTO> searchPatientById(@RequestParam Integer ID) {
        PatientDTO patientDTO = new PatientDTO();
        patientDTO.setPatientId(ID);
        return ResponseEntity.ok(patientManagementService.displayPatientById(patientDTO));
    }

    @PutMapping("/update")
    public ResponseEntity<PatientDTO> updatePatient(@RequestBody PatientDTO patientDTO) {
        return ResponseEntity.ok(patientManagementService.updatePatientById(patientDTO));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<PatientDTO> deletePatient(@RequestParam Integer patientId) {
        PatientDTO patientDTO = new PatientDTO();
        patientDTO.setPatientId(patientId);
        return ResponseEntity.ok(patientManagementService.deletePatient(patientDTO));
    }

}
