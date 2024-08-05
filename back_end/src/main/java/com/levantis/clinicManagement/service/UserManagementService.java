package com.levantis.clinicManagement.service;

import com.levantis.clinicManagement.dto.UserDTO;
import com.levantis.clinicManagement.entity.Patient;
import com.levantis.clinicManagement.entity.Role;
import com.levantis.clinicManagement.entity.User;
import com.levantis.clinicManagement.repository.PatientRepository;
import com.levantis.clinicManagement.repository.RoleRepository;
import com.levantis.clinicManagement.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
public class UserManagementService {

    private static final Logger log = LoggerFactory.getLogger(UserManagementService.class);
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private JwtUtils jwtUtils;
    @Autowired
    private AuthenticationManager  authenticationManager;
    @Autowired
    private PasswordEncoder passwordEncoder;

    /* Sign up a user in the system */
    public UserDTO registerUser(UserDTO registrationRequest) {
        UserDTO resp = new UserDTO();
        try {

            User user = new User();
            user.setUser_name(registrationRequest.getUserName());
            user.setUser_surname(registrationRequest.getUserSurname());
            user.setUser_idNumber(registrationRequest.getUserIdNumber());
            user.setEmail(registrationRequest.getUserEmail());
            user.setUser_password(passwordEncoder.encode(registrationRequest.getUserPassword()));

            Role role = roleRepository.findById(registrationRequest.getRoleId())
                    .orElseThrow(() -> new RuntimeException("Role not found"));
            user.setRole(role);
            user.setRole_str(role.getRole_description());

            User userResult = userRepository.save(user);

            // Continue with updating the other tables (Patient and Doctor) based on the role
            registerRoleUser(user, registrationRequest);

            if(userResult.getUser_id() > 0) {
                resp.setUsers(userResult);
                resp.setMessage("User registered successfully");
                resp.setStatusCode(200);
                log.info("User registered successfully, email: {}", registrationRequest.getUserEmail());
            }
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    private void registerRoleUser(User user, UserDTO registrationRequest) throws Exception {
        System.out.println("TEST --> " + user.getRole_str());
        if(user.getRole_str().equals("USER_PATIENT")) {
            Patient patient = new Patient();
            patient.setUser(user);
            patient.setPatient_AMKA(registrationRequest.getPatientAMKA());
            patient.setPatientRegistrationDate(Date.valueOf(LocalDate.now()));
            Patient patientResult = patientRepository.save(patient);
            if(patientResult.getPatient_id() > 0) {
                log.info("Patient registered successfully, email: {}", registrationRequest.getUserEmail());
            } else
                throw new Exception();
        }
    }

    public UserDTO login(UserDTO loginRequest) {
        UserDTO resp = new UserDTO();
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUserEmail(),
                            loginRequest.getUserPassword()));
            var user = userRepository.findByEmail(loginRequest.getUserEmail()).orElseThrow();
            var jwt = jwtUtils.generateToken(user);
            var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);
            resp.setStatusCode(200);
            resp.setToken(jwt);
            resp.setRefreshToken(refreshToken);
            resp.setExpirationTime("24Hrs");
            resp.setMessage("User logged in successfully");
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    public UserDTO refreshToken(UserDTO refreshTokenReqiest){
        UserDTO response = new UserDTO();
        try{
            String ourEmail = jwtUtils.extractUsername(refreshTokenReqiest.getToken());
            User users = userRepository.findByEmail(ourEmail).orElseThrow();
            if (jwtUtils.isTokenValid(refreshTokenReqiest.getToken(), users)) {
                var jwt = jwtUtils.generateToken(users);
                response.setStatusCode(200);
                response.setToken(jwt);
                response.setRefreshToken(refreshTokenReqiest.getToken());
                response.setExpirationTime("24Hr");
                response.setMessage("Successfully Refreshed Token");
            }
            response.setStatusCode(200);
            return response;

        }catch (Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
            return response;
        }
    }

    public UserDTO getAllUsers() {
        UserDTO UserDTO = new UserDTO();

        try {
            List<User> result = userRepository.findAll();
            if (!result.isEmpty()) {
                UserDTO.setUserList(result);
                UserDTO.setStatusCode(200);
                UserDTO.setMessage("Successful");
            } else {
                UserDTO.setStatusCode(404);
                UserDTO.setMessage("No users found");
            }
            return UserDTO;
        } catch (Exception e) {
            UserDTO.setStatusCode(500);
            UserDTO.setMessage("Error occurred: " + e.getMessage());
            return UserDTO;
        }
    }

    public UserDTO getUsersById(Integer id) {
        UserDTO UserDTO = new UserDTO();
        try {
            User usersById = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User Not found"));
            UserDTO.setUsers(usersById);
            UserDTO.setStatusCode(200);
            UserDTO.setMessage("Users with id '" + id + "' found successfully");
        } catch (Exception e) {
            UserDTO.setStatusCode(500);
            UserDTO.setMessage("Error occurred: " + e.getMessage());
        }
        return UserDTO;
    }

    public UserDTO deleteUser(Integer userId) {
        UserDTO UserDTO = new UserDTO();
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isPresent()) {
                userRepository.deleteById(userId);
                UserDTO.setStatusCode(200);
                UserDTO.setMessage("User deleted successfully");
            } else {
                UserDTO.setStatusCode(404);
                UserDTO.setMessage("User not found for deletion");
            }
        } catch (Exception e) {
            UserDTO.setStatusCode(500);
            UserDTO.setMessage("Error occurred while deleting user: " + e.getMessage());
        }
        return UserDTO;
    }


    public UserDTO updateUser(Integer userId, User updatedUser) {
        UserDTO UserDTO = new UserDTO();
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isPresent()) {
                User existingUser = userOptional.get();
                existingUser.setEmail(updatedUser.getEmail());
                existingUser.setUser_name(updatedUser.getUser_name());
                existingUser.setUser_surname(updatedUser.getUser_surname());
                existingUser.setRole(updatedUser.getRole());

                // Check if password is present in the request
                if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                    // Encode the password and update it
                    existingUser.setUser_password(passwordEncoder.encode(updatedUser.getPassword()));
                }

                User savedUser = userRepository.save(existingUser);
                UserDTO.setUsers(savedUser);
                UserDTO.setStatusCode(200);
                UserDTO.setMessage("User updated successfully");
            } else {
                UserDTO.setStatusCode(404);
                UserDTO.setMessage("User not found for update");
            }
        } catch (Exception e) {
            UserDTO.setStatusCode(500);
            UserDTO.setMessage("Error occurred while updating user: " + e.getMessage());
        }
        return UserDTO;
    }

    public UserDTO getMyInfo(String email){
        UserDTO UserDTO = new UserDTO();
        try {
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                UserDTO.setUsers(userOptional.get());
                UserDTO.setStatusCode(200);
                UserDTO.setMessage("successful");
            } else {
                UserDTO.setStatusCode(404);
                UserDTO.setMessage("User not found for update");
            }

        }catch (Exception e){
            UserDTO.setStatusCode(500);
            UserDTO.setMessage("Error occurred while getting user info: " + e.getMessage());
        }
        return UserDTO;
    }
}
