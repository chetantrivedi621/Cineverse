package com.cineverse.backend.config;

import com.cineverse.backend.entity.User;
import com.cineverse.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class TheatreOwnerDatabaseSeeder implements ApplicationRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        seedTheatreOwners();
    }

    private void seedTheatreOwners() {
        List<OwnerSeed> seeds = new ArrayList<>();
        seeds.add(new OwnerSeed("PVR Elante Owner", "elante@gmail.com", "elante", "PVR: Elante, Chandigarh", "Chandigarh"));
        seeds.add(new OwnerSeed("Cinepolis TDI Owner", "tdimall@gmail.com", "tdimall", "Cinepolis: TDI Mall, Chandigarh", "Chandigarh"));
        seeds.add(new OwnerSeed("PVR Centra Owner", "centramall@gmail.com", "centramall", "PVR: Centra Mall, Chandigarh", "Chandigarh"));
        seeds.add(new OwnerSeed("PVR CP67 Owner", "cp67@gmail.com", "cp67", "PVR: CP67 Mall, Mohali", "Mohali"));
        seeds.add(new OwnerSeed("Cinepolis Bestech Owner", "bestech@gmail.com", "bestech", "Cinepolis: Bestech Square, Mohali", "Mohali"));
        seeds.add(new OwnerSeed("PVR Mohali Walk Owner", "mohaliwalk@gmail.com", "mohaliwalk", "PVR: MOHALI WALK", "Mohali"));
        seeds.add(new OwnerSeed("PVR Cosmo Owner", "cosmo@gmail.com", "cosmo", "PVR: Cosmo Mall, Zirakpur", "Zirakpur"));
        seeds.add(new OwnerSeed("INOX Dhillon Owner", "dhillon@gmail.com", "dhillon", "INOX: Dhillon Plaza, Zirakpur", "Zirakpur"));
        seeds.add(new OwnerSeed("PVR Juhu Owner", "juhu@gmail.com", "juhu", "PVR: Dynamix Mall, Juhu, Mumbai", "Mumbai"));
        seeds.add(new OwnerSeed("Cinepolis Fun Republic Owner", "funrepublic@gmail.com", "funrepublic", "Cinepolis: Fun Republic, Andheri, Mumbai", "Mumbai"));
        seeds.add(new OwnerSeed("INOX Inorbit Owner", "inorbit@gmail.com", "inorbit", "INOX: Inorbit Mall, Malad, Mumbai", "Mumbai"));
        seeds.add(new OwnerSeed("PVR Ambience Owner", "ambience@gmail.com", "ambience", "PVR: Director's Cut, Ambience Mall, Vasant Kunj", "Delhi-NCR"));
        seeds.add(new OwnerSeed("PVR Plaza Owner", "plaza@gmail.com", "plaza", "PVR: Plaza, Connaught Place, Delhi", "Delhi-NCR"));
        seeds.add(new OwnerSeed("Cinepolis DLF Owner", "dlfavenue@gmail.com", "dlfavenue", "Cinepolis: DLF Avenue, Saket, Delhi", "Delhi-NCR"));
        seeds.add(new OwnerSeed("PVR Forum Owner", "forum@gmail.com", "forum", "PVR: Forum Mall, Koramangala, Bengaluru", "Bengaluru"));
        seeds.add(new OwnerSeed("Cinepolis Royal Owner", "royal@gmail.com", "royal", "Cinepolis: Royal Meenakshi Mall, Bengaluru", "Bengaluru"));
        seeds.add(new OwnerSeed("PVR Phoenix Owner", "phoenix@gmail.com", "phoenix", "PVR: Phoenix Marketcity, Whitefield, Bengaluru", "Bengaluru"));
        seeds.add(new OwnerSeed("PVR Forum Sujana Owner", "sujana@gmail.com", "sujana", "PVR: Forum Sujana Mall, Kukatpally, Hyderabad", "Hyderabad"));
        seeds.add(new OwnerSeed("Cinepolis Mantra Owner", "mantra@gmail.com", "mantra", "Cinepolis: Mantra Mall, Attapur, Hyderabad", "Hyderabad"));
        seeds.add(new OwnerSeed("Prasads Multiplex Owner", "prasads@gmail.com", "prasads", "Prasads Multiplex, Hyderabad", "Hyderabad"));
        seeds.add(new OwnerSeed("PVR Acropolis Owner", "acropolis@gmail.com", "acropolis", "PVR: Acropolis Mall, Ahmedabad", "Ahmedabad"));
        seeds.add(new OwnerSeed("Cinepolis Alpha Owner", "alphaone@gmail.com", "alphaone", "Cinepolis: Alpha One Mall, Vastrapur, Ahmedabad", "Ahmedabad"));
        seeds.add(new OwnerSeed("PVR Viman Nagar Owner", "pimpriloc@gmail.com", "pimpriloc", "PVR: Phoenix Marketcity, Viman Nagar, Pune", "Pune"));
        seeds.add(new OwnerSeed("Cinepolis Westend Owner", "westend@gmail.com", "westend", "Cinepolis: Westend Mall, Aundh, Pune", "Pune"));
        seeds.add(new OwnerSeed("PVR Ampa Owner", "ampa@gmail.com", "ampa", "PVR: Ampa Skywalk Mall, Aminjikarai, Chennai", "Chennai"));
        seeds.add(new OwnerSeed("Sathyam Owner", "sathyam@gmail.com", "sathyam", "Sathyam Cinemas: Royapettah, Chennai", "Chennai"));
        seeds.add(new OwnerSeed("PVR Mani Owner", "manisquare@gmail.com", "manisquare", "PVR: Mani Square Mall, Kolkata", "Kolkata"));
        seeds.add(new OwnerSeed("Cinepolis Acropolis Owner", "acropolisko@gmail.com", "acropolisko", "Cinepolis: Acropolis Mall, Kolkata", "Kolkata"));
        seeds.add(new OwnerSeed("PVR Lulu Owner", "lulu@gmail.com", "lulu", "PVR: Lulu Mall, Edappally, Kochi", "Kochi"));
        seeds.add(new OwnerSeed("Cinepolis Centre Owner", "centresquare@gmail.com", "centresquare", "Cinepolis: Centre Square Mall, Kochi", "Kochi"));

        boolean seeded = false;
        for (OwnerSeed seed : seeds) {
            if (!userRepository.existsByEmail(seed.email)) {
                User user = new User(
                        seed.name,
                        seed.email,
                        passwordEncoder.encode(seed.password),
                        "THEATRE_OWNER"
                );
                user.setCinemaName(seed.cinemaName);
                user.setCity(seed.city);
                user.setStatus("APPROVED"); // Auto-approved for seeds
                userRepository.save(user);
                seeded = true;
            }
        }
        if (seeded) {
            System.out.println("CineVerse auth-service successfully seeded 30 Theatre Owner accounts!");
        }
    }

    private static class OwnerSeed {
        String name;
        String email;
        String password;
        String cinemaName;
        String city;

        OwnerSeed(String name, String email, String password, String cinemaName, String city) {
            this.name = name;
            this.email = email;
            this.password = password;
            this.cinemaName = cinemaName;
            this.city = city;
        }
    }
}
