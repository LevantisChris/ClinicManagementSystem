package com.levantis.clinicManagement.controller;

import com.levantis.clinicManagement.dto.AppointmentDTO;
import com.levantis.clinicManagement.dto.WorkingHoursDTO;
import com.levantis.clinicManagement.service.AppointmentManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@RestController
public class AppointmentManagementController {

    @Autowired
    private AppointmentManagementService appointmentManagementService;

    @PostMapping("/appoint/register-wh")
    public ResponseEntity<WorkingHoursDTO> registerWorkingHours(@RequestBody WorkingHoursDTO workingHours) {
            return ResponseEntity.ok(appointmentManagementService.defineWorkingHours(workingHours));
    }

    @GetMapping("/appoint/get-wh")
    public ResponseEntity<List<WorkingHoursDTO>> getWorkingHours() {
        return ResponseEntity.ok(appointmentManagementService.getWorkingHoursOfADoctor());
    }

    @DeleteMapping("/appoint/delete-wh")
    public ResponseEntity<WorkingHoursDTO> deleteWorkingHours(@RequestBody WorkingHoursDTO workingHours) {
        return ResponseEntity.ok(appointmentManagementService.deleteWorkingHours(workingHours));
    }

    @PostMapping("/appoint/create")
    public ResponseEntity<AppointmentDTO> createAppointment(@RequestBody AppointmentDTO appointment) {
        return ResponseEntity.ok(appointmentManagementService.createAppointment(appointment));
    }

    @PutMapping("/appoint/update")
    public ResponseEntity<AppointmentDTO> updateAppointment(@RequestBody AppointmentDTO appointment) {
        return ResponseEntity.ok(appointmentManagementService.updateAppointment(appointment));
    }

    @PutMapping("/appoint/cancel")
    public ResponseEntity<AppointmentDTO> canceledAppointment(@RequestBody AppointmentDTO appointment) {
        return ResponseEntity.ok(appointmentManagementService.cancelAppointment(appointment));
    }

    @GetMapping("/appoint/display-by-id")
    public ResponseEntity<AppointmentDTO> displayAppointmentById(@RequestBody AppointmentDTO appointment) {
        return ResponseEntity.ok(appointmentManagementService.displayAppointmentById(appointment));
    }

    @GetMapping("/appoint/search")
    public ResponseEntity<AppointmentDTO> searchAppointment(@RequestBody AppointmentDTO appointment) {
        return ResponseEntity.ok(appointmentManagementService.searchAppointments(appointment));
    }

    /* Get all appointments for a specific doctor */
    @GetMapping("/appoint/getAll")
    public ResponseEntity<AppointmentDTO> getAllAppointments(@RequestParam String appointmentDate) {
        AppointmentDTO appointment = new AppointmentDTO();
        appointment.setAppointmentDate(strToDate(appointmentDate));
        return ResponseEntity.ok(appointmentManagementService.getAllAppointments_doctor(appointment));
    }

    /*------------------------------------------------------------------------------------------------------------------*/

    private LocalDate strToDate(String dateString) {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        try {
            Date date = formatter.parse(dateString);
            return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return null;
    }


}
