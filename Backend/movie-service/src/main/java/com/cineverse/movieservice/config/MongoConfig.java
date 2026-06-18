package com.cineverse.movieservice.config;

import de.flapdoodle.embed.mongo.commands.MongodArguments;
import de.flapdoodle.embed.mongo.config.Net;
import de.flapdoodle.embed.mongo.transitions.Mongod;
import de.flapdoodle.embed.mongo.types.DatabaseDir;
import de.flapdoodle.reverse.transitions.Start;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class MongoConfig {

    @Bean
    public Mongod mongod(Net net, MongodArguments mongodArguments) {
        String userDir = System.getProperty("user.dir");
        Path dbPath;
        if (userDir.contains("movie-service")) {
            dbPath = Paths.get(userDir, "mongodata");
        } else if (userDir.contains("Backend")) {
            dbPath = Paths.get(userDir, "movie-service", "mongodata");
        } else {
            dbPath = Paths.get(userDir, "Backend", "movie-service", "mongodata");
        }
        
        // Fallback to absolute path if path resolution failed to find correct workspace location
        if (!Files.exists(dbPath) && !Files.exists(dbPath.getParent())) {
            dbPath = Paths.get("d:/Downloads/CineVerse/Backend/movie-service/mongodata");
        }
        
        if (!Files.exists(dbPath)) {
            try {
                Files.createDirectories(dbPath);
            } catch (IOException e) {
                throw new RuntimeException("Failed to create Embedded MongoDB data directory: " + dbPath, e);
            }
        }
        return Mongod.instance()
            .withMongodArguments(Start.to(MongodArguments.class).initializedWith(mongodArguments))
            .withDatabaseDir(Start.to(DatabaseDir.class).initializedWith(DatabaseDir.of(dbPath)))
            .withNet(Start.to(Net.class).initializedWith(net));
    }

    @Bean
    public MongodArguments mongodArguments() {
        return MongodArguments.builder()
            .useNoJournal(false)
            .build();
    }
}
