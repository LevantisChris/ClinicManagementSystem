package com.levantis.clinicManagement.service;

import com.levantis.clinicManagement.dto.UserDTO;
import com.levantis.clinicManagement.entity.*;
import com.levantis.clinicManagement.repository.*;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.sql.Date;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;
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
    @Autowired
    private DoctorSpecialityRepository doctorSpecialityRepository;
    @Autowired
    private DoctorRepository doctorRepository;

    /* Sign up a user in the system */
    public UserDTO registerUser(UserDTO registrationRequest) {
        UserDTO resp = new UserDTO();
        if(registrationRequest.getUserName() == null || registrationRequest.getUserName().isEmpty()
                || registrationRequest.getUserSurname() == null || registrationRequest.getUserSurname().isEmpty()
                || registrationRequest.getUserIdNumber() == null || registrationRequest.getUserIdNumber().isEmpty()
                || registrationRequest.getUserPassword() == null || registrationRequest.getUserPassword().isEmpty()
                || registrationRequest.getUserEmail() == null || registrationRequest.getUserEmail().isEmpty()) {
            log.error("Empty/null fields");
            resp.setMessage("Empty/null fields.");
            resp.setStatusCode(500);
            return resp;
        }
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

            var jwt = jwtUtils.generateToken(user);
            var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);
            resp.setToken(jwt);

            User userResult = userRepository.save(user);

            // Continue with updating the other tables (Patient and Doctor) based on the role
            registerRoleUser(user, registrationRequest);

            if(userResult.getUser_id() > 0) {
                if(Objects.equals(user.getRole().getRole_description(), "USER_PATIENT"))
                    resp.setPatient(user.getPatient());
                resp.setUsers(userResult);
                resp.setMessage("User registered successfully");
                resp.setStatusCode(200);
                log.info("User registered successfully, email: {}", registrationRequest.getUserEmail());
            }
        } catch (Exception e) {
            log.error("Error registering user", e);
            e.printStackTrace();
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    private void registerRoleUser(User user, UserDTO registrationRequest) throws Exception {
           try {
               if (user.getRole_str().equals("USER_PATIENT")) {
                   Patient patient = new Patient();
                   patient.setUser(user);
                   patient.setPatient_AMKA(registrationRequest.getPatientAMKA());
                   patient.setPatientRegistrationDate(Date.valueOf(LocalDate.now()));
                   Patient patientResult = patientRepository.save(patient);
                   if (patientResult.getPatient_id() > 0) {
                       log.info("Patient registered successfully, email: {}", registrationRequest.getUserEmail());
                   } else
                       throw new Exception();
               } else if (user.getRole_str().equals("USER_DOCTOR")) {
                   Doctor doctor = new Doctor();
                   doctor.setUser(user);

                   DoctorSpeciality doctorSpeciality =
                           doctorSpecialityRepository.findById(registrationRequest.getDoctorSpecialityId())
                                   .orElseThrow(() -> new RuntimeException("Doctor speciality not found"));
                   doctor.setDoctorSpeciality(doctorSpeciality);
                   Doctor doctorResult = doctorRepository.save(doctor);
                   if (doctorResult.getDoctor_id() > 0) {
                       log.info("Doctor registered successfully, email: {}", registrationRequest.getUserEmail());
                   }
               }
           } catch (Exception e) {
               e.printStackTrace();
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

            resp.setRoleId(user.getRole().getRole_id());
            resp.setRoleName(user.getRole().getRole_description());
            resp.setUsers(user);
            if(Objects.equals(user.getRole().getRole_description(), "USER_PATIENT"))
                resp.setPatient(user.getPatient());
            resp.setRefreshToken(refreshToken);
            resp.setExpirationTime("24Hrs");
            resp.setMessage("User logged in successfully");
        } catch (Exception e) {
            log.error("Error logging in", e);
            resp.setStatusCode(500);
            resp.setMessage("User login failed in server: " + e.getMessage());
            resp.setError(e.getMessage());
        }
        return resp;
    }

    public UserDTO refreshToken(UserDTO refreshTokenRequest){
        UserDTO response = new UserDTO();
        try{
            String ourEmail = jwtUtils.extractUsername(refreshTokenRequest.getToken());
            User users = userRepository.findByEmail(ourEmail).orElseThrow();
            if (jwtUtils.isTokenValid(refreshTokenRequest.getToken(), users)) {
                var jwt = jwtUtils.generateToken(users);
                response.setStatusCode(200);
                response.setToken(jwt);
                response.setRefreshToken(refreshTokenRequest.getToken());
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

    public UserDTO getDoctorIdByToken() {
        UserDTO resp = new UserDTO();
        try {
            String jwtToken = getToken();
            if (jwtToken == null) {
                log.error("Empty/null token");
                resp.setMessage("Empty/null token.");
                resp.setStatusCode(500);
                return resp;
            }
            User user = userRepository.findByEmail(jwtUtils.extractUsername(jwtToken))
                    .orElseThrow(() -> new RuntimeException("User (Doctor) Not found"));
            resp.setDoctorId(user.getDoctor().getDoctor_id());
            resp.setStatusCode(200);
            resp.setMessage("Doctor with email: " + user.getEmail() + " found successfully.");
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setMessage("User (doctor) not found).");
        }
        return resp;
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
                if(userOptional.get().getRole_str().equals("USER_PATIENT")) {
                    UserDTO.setPatient(userOptional.get().getPatient());
                }
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

    /*------------------------------------------------------------------------------------------------------------------------------------------------*/

    private String getToken() {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String authorizationHeader = request.getHeader("Authorization");
        String jwtToken = null;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwtToken = authorizationHeader.substring(7);
            return jwtToken;
        }
        return null;
    }
}
