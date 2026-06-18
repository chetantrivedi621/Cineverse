package com.cineverse.backend.controller;

import com.cineverse.backend.dto.*;
import com.cineverse.backend.service.AuthService;
import com.cineverse.backend.entity.User;
import com.cineverse.backend.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> registerUser(@Valid @RequestBody RegisterDTO registerDTO) {
        AuthResponseDTO response = authService.registerUser(registerDTO);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> authenticateUser(@Valid @RequestBody LoginDTO loginDTO) {
        AuthResponseDTO response = authService.loginUser(loginDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/logout")
    public ResponseEntity<MessageResponseDTO> logoutUser() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(new MessageResponseDTO("Successfully logged out"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponseDTO> forgotPassword(@Valid @RequestBody ForgotPasswordDTO forgotPasswordDTO) {
        authService.forgotPassword(forgotPasswordDTO);
        return ResponseEntity.ok(new MessageResponseDTO("Password reset instructions have been logged. You can now reset your password."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponseDTO> resetPassword(@Valid @RequestBody ResetPasswordDTO resetPasswordDTO) {
        authService.resetPassword(resetPasswordDTO);
        return ResponseEntity.ok(new MessageResponseDTO("Password has been successfully reset."));
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<User> updateUserRole(@PathVariable Long id, @RequestBody String newRole) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        String cleanRole = newRole.replace("\"", "").trim();
        user.setRole(cleanRole);
        return ResponseEntity.ok(userRepository.save(user));
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<User> updateUserStatus(@PathVariable Long id, @RequestBody String newStatus) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        String cleanStatus = newStatus.replace("\"", "").trim().toUpperCase();
        user.setStatus(cleanStatus);
        return ResponseEntity.ok(userRepository.save(user));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
