package com.cineverse.backend;

import com.cineverse.backend.entity.User;
import com.cineverse.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed the requested admin user
        if (!userRepository.existsByEmail("gagkaur274@gmail.com")) {
            User admin = new User(
                "Gagan Admin",
                "gagkaur274@gmail.com",
                passwordEncoder.encode("Chetan23"),
                "ADMIN"
            );
            userRepository.save(admin);
            System.out.println("Seeded admin user: gagkaur274@gmail.com");
        }
    }
}
