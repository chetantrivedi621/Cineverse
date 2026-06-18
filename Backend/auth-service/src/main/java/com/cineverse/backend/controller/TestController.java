package com.cineverse.backend.controller;

import com.cineverse.backend.dto.MessageResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/tickets/book")
    public ResponseEntity<MessageResponseDTO> bookTickets() {
        return ResponseEntity.ok(new MessageResponseDTO("Success: Ticket booked! (Restricted to USER)"));
    }

    @GetMapping("/api/shows/manage")
    public ResponseEntity<MessageResponseDTO> manageShows() {
        return ResponseEntity.ok(new MessageResponseDTO("Success: Show management accessed! (Restricted to THEATRE_OWNER, ADMIN)"));
    }

    @GetMapping("/api/users/manage")
    public ResponseEntity<MessageResponseDTO> manageUsers() {
        return ResponseEntity.ok(new MessageResponseDTO("Success: User management accessed! (Restricted to ADMIN)"));
    }
}
