package com.levantis.clinicManagement.controller;

import com.levantis.clinicManagement.dto.AppointmentDTO;
import com.levantis.clinicManagement.dto.WorkingHoursDTO;
import com.levantis.clinicManagement.service.AppointmentManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AppointmentManagementController {

    @Autowired
    private AppointmentManagementService appointmentManagementService;

    @PostMapping("/appoint/register-wh")
    public ResponseEntity<WorkingHoursDTO> registerWorkingHours(@RequestBody WorkingHoursDTO workingHours) {
            return ResponseEntity.ok(appointmentManagementService.defineWorkingHours(workingHours));
    }

    @DeleteMapping("/appoint/delete-wh")
    public ResponseEntity<WorkingHoursDTO> deleteWorkingHours(@RequestBody WorkingHoursDTO workingHours) {
        return ResponseEntity.ok(appointmentManagementService.deleteWorkingHours(workingHours));
    }

    @PostMapping("/appoint/create")
    public ResponseEntity<AppointmentDTO> createAppointment(@RequestBody AppointmentDTO appointment) {
        return ResponseEntity.ok(appointmentManagementService.createAppointment(appointment));
    }

}
