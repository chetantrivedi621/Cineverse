package com.cineverse.movieservice.controller;

import com.cineverse.movieservice.entity.Movie;
import com.cineverse.movieservice.entity.Show;
import com.cineverse.movieservice.entity.Booking;
import com.cineverse.movieservice.dto.ShowResponseDTO;
import com.cineverse.movieservice.repository.MovieRepository;
import com.cineverse.movieservice.repository.ShowRepository;
import com.cineverse.movieservice.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private ShowRepository showRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @GetMapping
    public ResponseEntity<List<Movie>> getAllMovies() {
        return ResponseEntity.ok(movieRepository.findAll());
    }

    @GetMapping("/trending")
    public ResponseEntity<List<Movie>> getTrendingMovies() {
        List<Movie> all = movieRepository.findAll();
        List<Movie> trending = all.stream().limit(3).collect(Collectors.toList());
        return ResponseEntity.ok(trending);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovieById(@PathVariable String id) {
        return movieRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{movieId}/shows")
    public ResponseEntity<List<ShowResponseDTO>> getShowsForMovie(
            @PathVariable String movieId,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Integer dayOffset) {
        
        List<Show> shows;
        if (city != null && dayOffset != null) {
            shows = showRepository.findByMovieIdAndCityIgnoreCaseAndDayOffset(movieId, city, dayOffset);
        } else if (city != null) {
            shows = showRepository.findByMovieIdAndCityIgnoreCase(movieId, city);
        } else {
            shows = showRepository.findByMovieId(movieId);
        }
        
        List<ShowResponseDTO> dtos = shows.stream()
                .map(show -> {
                    List<String> booked = new java.util.ArrayList<>(
                        bookingRepository.findByShowId(show.getId()).stream()
                            .map(Booking::getSeatNumber)
                            .collect(Collectors.toList())
                    );
                    return new ShowResponseDTO(
                            show.getId(), 
                            show.getShowTime(), 
                            show.getPrice(), 
                            show.getCity(), 
                            show.getCinema(), 
                            show.getDayOffset(),
                            booked);
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<Movie> addMovie(@RequestBody Movie movie) {
        return ResponseEntity.ok(movieRepository.save(movie));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Movie> updateMovie(@PathVariable String id, @RequestBody Movie movieDetails) {
        return movieRepository.findById(id)
                .map(existingMovie -> {
                    existingMovie.setTitle(movieDetails.getTitle());
                    existingMovie.setGenre(movieDetails.getGenre());
                    existingMovie.setRating(movieDetails.getRating());
                    existingMovie.setDuration(movieDetails.getDuration());
                    existingMovie.setDescription(movieDetails.getDescription());
                    existingMovie.setImageUrl(movieDetails.getImageUrl());
                    return ResponseEntity.ok(movieRepository.save(existingMovie));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable String id) {
        List<Show> shows = showRepository.findByMovieId(id);
        for (Show show : shows) {
            List<Booking> bookings = bookingRepository.findByShowId(show.getId());
            bookingRepository.deleteAll(bookings);
            showRepository.delete(show);
        }
        movieRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/shows")
    public ResponseEntity<Show> addShow(@RequestBody Show showRequest) {
        Movie movie = movieRepository.findById(showRequest.getMovie().getId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid Movie ID"));
        showRequest.setMovie(movie);
        return ResponseEntity.ok(showRepository.save(showRequest));
    }

    // Cinema-scoped: Remove all shows for a movie at a specific cinema+city (owner action)
    @DeleteMapping("/{movieId}/shows/cinema")
    public ResponseEntity<Void> deleteShowsByCinema(
            @PathVariable String movieId,
            @RequestParam String cinema,
            @RequestParam String city) {
        List<Show> shows = showRepository.findByMovieIdAndCinemaIgnoreCaseAndCityIgnoreCase(movieId, cinema, city);
        for (Show show : shows) {
            List<Booking> bookings = bookingRepository.findByShowId(show.getId());
            bookingRepository.deleteAll(bookings);
            showRepository.delete(show);
        }

        if (showRepository.findByMovieId(movieId).isEmpty()) {
            movieRepository.deleteById(movieId);
        }

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/shows/{showId}")
    public ResponseEntity<Void> deleteShow(@PathVariable String showId) {
        List<Booking> bookings = bookingRepository.findByShowId(showId);
        bookingRepository.deleteAll(bookings);
        showRepository.deleteById(showId);
        return ResponseEntity.ok().build();
    }

    @Autowired
    private org.springframework.context.ApplicationContext context;

    @PostMapping("/shutdown")
    public ResponseEntity<String> shutdown() {
        System.out.println("Clean shutdown triggered via API...");
        new Thread(() -> {
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {}
            if (context instanceof org.springframework.context.ConfigurableApplicationContext) {
                ((org.springframework.context.ConfigurableApplicationContext) context).close();
                System.exit(0);
            }
        }).start();
        return ResponseEntity.ok("Shutdown initiated cleanly.");
    }
}
