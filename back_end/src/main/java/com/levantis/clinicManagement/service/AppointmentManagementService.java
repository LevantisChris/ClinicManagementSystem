package com.levantis.clinicManagement.service;

import com.levantis.clinicManagement.dto.WorkingHoursDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class AppointmentManagementService {

    private static final Logger log = LoggerFactory.getLogger(AppointmentManagementService.class);

    public WorkingHoursDTO defineWorkingHours(WorkingHoursDTO registrationRequest) {
        WorkingHoursDTO resp = new WorkingHoursDTO();
        if(registrationRequest.getWorkingHoursId() == null
            || registrationRequest.getDoctorId() == null
            || registrationRequest.getWorkingHoursDate() == null
            || registrationRequest.getStartTime() == null
            || registrationRequest.getEndTime() == null) {
            log.error("Empty/null fields");
            resp.setMessage("Empty/null fields.");
            resp.setStatusCode(500);
            return resp;
        } else {

        }
    }
}
