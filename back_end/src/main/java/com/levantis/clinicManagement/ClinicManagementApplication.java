package com.levantis.clinicManagement;

import com.levantis.clinicManagement.entity.Role;
import com.levantis.clinicManagement.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ClinicManagementApplication implements CommandLineRunner {

	@Autowired
	private RoleRepository roleRepository;

	public static void main(String[] args) {
		SpringApplication.run(ClinicManagementApplication.class, args);
	}

	/* This are the pre-build values */
	@Override
	public void run(String... args) throws Exception {
		if (roleRepository.findAll().isEmpty()) {
			Role patientRole = new Role();
			patientRole.setRole_description("USER_PATIENT");

			Role secretaryRole = new Role();
			secretaryRole.setRole_description("USER_SECRETARY");

			Role doctorRole = new Role();
			doctorRole.setRole_description("USER_DOCTOR");

			roleRepository.save(patientRole);
			roleRepository.save(secretaryRole);
			roleRepository.save(doctorRole);
		}
	}
}
