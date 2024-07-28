package com.levantis.clinicManagement.service;

import com.levantis.clinicManagement.dto.CredentialsDTO;
import com.levantis.clinicManagement.dto.SignUpDTO;
import com.levantis.clinicManagement.dto.UserDTO;
import com.levantis.clinicManagement.entity.User;
import com.levantis.clinicManagement.exception.AppException;
import com.levantis.clinicManagement.mapper.UserMapper;
import com.levantis.clinicManagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.CharBuffer;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserDTO findByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));
        return userMapper.toUserDTO(user);
    }

    public UserDTO login(CredentialsDTO credentialsDTO) {
        User user = userRepository.findByEmail(credentialsDTO.getLogin())
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));

        if(passwordEncoder.matches(CharBuffer.wrap(credentialsDTO.getPassword(), user.getPassword()))) {
            return userMapper.toUserDTO(user);
        }

        throw new AppException("Invalid password", HttpStatus.BAD_REQUEST);
    }

    public UserDTO register(SignUpDTO userDTO) {
        Optional<User> optionalUser = userRepository.findByEmail(userDTO.getEmail());
        if(optionalUser.isPresent()) {
            throw new AppException("Login already Exists", HttpStatus.BAD_REQUEST);
        }
        User user = userMapper.signUpToUser(userDTO);

        user.setPassword(passwordEncoder.encode(CharBuffer.wrap(userDTO.getPassword())));

        User savedUser = userRepository.save(user);

        return userMapper.toUserDTO(savedUser);
    }
}
