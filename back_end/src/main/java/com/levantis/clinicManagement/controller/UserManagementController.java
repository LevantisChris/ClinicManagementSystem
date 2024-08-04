package com.levantis.clinicManagement.controller;

import com.levantis.clinicManagement.dto.UserDTO;
import com.levantis.clinicManagement.service.UserManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserManagementController {

    @Autowired
    private UserManagementService userManagementService;

    @PostMapping("/auth/register")
    public ResponseEntity<UserDTO> register(@RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userManagementService.registerUser(userDTO));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<UserDTO> login(@RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userManagementService.login(userDTO));
    }

    @PostMapping("auth/refresh")
    public ResponseEntity<UserDTO> refresh(@RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userManagementService.refreshToken(userDTO));
    }

    @GetMapping("/admin/get-all-users")
    public ResponseEntity<UserDTO> getAllUsers() {
        return ResponseEntity.ok(userManagementService.getAllUsers());
    }

    @GetMapping("/admin/get-users/{userid}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable("userid") int userid) {
        return ResponseEntity.ok(userManagementService.getUsersById(userid));
    }

    @PutMapping("/admin/update/{userId}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable("userid") int userid, @RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userManagementService.updateUser(userid, userDTO.getUsers())); // see the second parameter, might be wrong !!!
    }

    @GetMapping("/adminuser/get-profile")
    public ResponseEntity<UserDTO> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        UserDTO response = userManagementService.getMyInfo(email);
        return  ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/admin/delete/{userId}")
    public ResponseEntity<UserDTO> deleteUSer(@PathVariable Integer userId){
        return ResponseEntity.ok(userManagementService.deleteUser(userId));
    }
}
