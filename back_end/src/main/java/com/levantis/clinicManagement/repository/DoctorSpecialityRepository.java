package com.levantis.clinicManagement.repository;

import com.levantis.clinicManagement.entity.DoctorSpeciality;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DoctorSpecialityRepository extends JpaRepository<DoctorSpeciality, Integer> {
}
