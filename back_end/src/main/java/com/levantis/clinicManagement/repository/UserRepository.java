package com.levantis.clinicManagement.repository;

import com.levantis.clinicManagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);

    //User findByPatient(int patientid);
}
