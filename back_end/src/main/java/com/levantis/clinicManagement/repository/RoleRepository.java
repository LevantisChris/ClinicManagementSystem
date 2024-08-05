package com.levantis.clinicManagement.repository;

import com.levantis.clinicManagement.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Integer> {
}