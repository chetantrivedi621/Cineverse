package com.cineverse.backend.service;

import com.cineverse.backend.dto.*;
import com.cineverse.backend.entity.User;
import com.cineverse.backend.repository.UserRepository;
import com.cineverse.backend.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    private static final Set<String> VALID_ROLES = new HashSet<>(Arrays.asList("USER", "THEATRE_OWNER", "ADMIN"));

    public AuthResponseDTO registerUser(RegisterDTO registerDTO) {
        if (userRepository.existsByEmail(registerDTO.getEmail())) {
            throw new IllegalArgumentException("Email address already in use.");
        }

        String role = registerDTO.getRole().toUpperCase();
        if (!VALID_ROLES.contains(role)) {
            throw new IllegalArgumentException("Invalid role. Must be USER, THEATRE_OWNER, or ADMIN.");
        }

        // Create user
        User user = new User(
                registerDTO.getName(),
                registerDTO.getEmail(),
                passwordEncoder.encode(registerDTO.getPassword()),
                role
        );

        if ("THEATRE_OWNER".equals(role)) {
            user.setStatus("PENDING");
            user.setCinemaName(registerDTO.getCinemaName());
            user.setCity(registerDTO.getCity());
        }

        User savedUser = userRepository.save(user);

        if ("THEATRE_OWNER".equals(role)) {
            UserDTO userDTO = new UserDTO(savedUser.getId(), savedUser.getName(), savedUser.getEmail(), savedUser.getRole(), savedUser.getCinemaName(), savedUser.getCity(), savedUser.getStatus());
            return new AuthResponseDTO(null, userDTO);
        }

        // Authenticate immediately after registration
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        registerDTO.getEmail(),
                        registerDTO.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserDTO userDTO = new UserDTO(savedUser.getId(), savedUser.getName(), savedUser.getEmail(), savedUser.getRole(), savedUser.getCinemaName(), savedUser.getCity(), savedUser.getStatus());
        return new AuthResponseDTO(jwt, userDTO);
    }

    public AuthResponseDTO loginUser(LoginDTO loginDTO) {
        User user = userRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if ("THEATRE_OWNER".equals(user.getRole()) && user.getStatus() != null && !"APPROVED".equals(user.getStatus())) {
            throw new IllegalArgumentException("Your theatre registration request is pending admin approval.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDTO.getEmail(),
                        loginDTO.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserDTO userDTO = new UserDTO(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getCinemaName(), user.getCity(), user.getStatus());
        return new AuthResponseDTO(jwt, userDTO);
    }

    public void forgotPassword(ForgotPasswordDTO forgotPasswordDTO) {
        User user = userRepository.findByEmail(forgotPasswordDTO.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + forgotPasswordDTO.getEmail()));
        
        // Mock sending reset instructions - in a real app, this sends an email with a reset link.
        System.out.println("Password reset request received for: " + user.getEmail());
    }

    public void resetPassword(ResetPasswordDTO resetPasswordDTO) {
        User user = userRepository.findByEmail(resetPasswordDTO.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + resetPasswordDTO.getEmail()));

        user.setPassword(passwordEncoder.encode(resetPasswordDTO.getNewPassword()));
        userRepository.save(user);
    }
}
