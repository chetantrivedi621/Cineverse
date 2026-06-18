package com.cineverse.movieservice.controller;

import com.cineverse.movieservice.entity.Booking;
import com.cineverse.movieservice.entity.Show;
import com.cineverse.movieservice.entity.SeatLock;
import com.cineverse.movieservice.dto.BookingRequestDTO;
import com.cineverse.movieservice.dto.BookingResponseDTO;
import com.cineverse.movieservice.repository.BookingRepository;
import com.cineverse.movieservice.repository.ShowRepository;
import com.cineverse.movieservice.repository.SeatLockRepository;
import com.cineverse.movieservice.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ShowRepository showRepository;

    @Autowired
    private SeatLockRepository seatLockRepository;

    @PostMapping
    @Transactional
    public ResponseEntity<BookingResponseDTO> createBooking(
            @Valid @RequestBody BookingRequestDTO request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        if (userPrincipal == null) {
            throw new IllegalArgumentException("User details not found in session context.");
        }

        Show show = showRepository.findById(request.getShowId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid Show ID"));

        // Critical Section: Prevent double booking
        if (bookingRepository.existsByShowIdAndSeatNumber(request.getShowId(), request.getSeatNumber())) {
            throw new IllegalArgumentException("Seat " + request.getSeatNumber() + " is already booked for this show time.");
        }

        // Check if seat is temporarily locked by another user
        java.util.Optional<SeatLock> activeLock = seatLockRepository.findByShowIdAndSeatNumber(request.getShowId(), request.getSeatNumber());
        if (activeLock.isPresent() && !activeLock.get().getUserId().equals(userPrincipal.getId())) {
            throw new IllegalArgumentException("Seat " + request.getSeatNumber() + " is temporarily held by another user.");
        }

        Booking booking = new Booking(
                userPrincipal.getId(),
                show,
                request.getSeatNumber(),
                LocalDateTime.now()
        );

        double seatPrice = show.getPrice();
        if (request.getSeatNumber().startsWith("A")) {
            seatPrice += 450.00;
        } else if (request.getSeatNumber().startsWith("B")) {
            seatPrice += 50.00;
        }

        Booking savedBooking = bookingRepository.save(booking);

        // Delete temporary lock upon successful booking
        seatLockRepository.deleteByShowIdAndSeatNumberAndUserId(request.getShowId(), request.getSeatNumber(), userPrincipal.getId());

        BookingResponseDTO response = new BookingResponseDTO(
                savedBooking.getId(),
                show.getMovie().getTitle(),
                show.getShowTime(),
                seatPrice,
                savedBooking.getSeatNumber(),
                savedBooking.getBookedAt(),
                show.getCinema(),
                show.getCity(),
                show.getDayOffset()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            throw new IllegalArgumentException("User details not found in session context.");
        }

        List<Booking> bookings = bookingRepository.findByUserIdOrderByBookedAtDesc(userPrincipal.getId());
        List<BookingResponseDTO> responses = bookings.stream()
                .filter(b -> b.getShow() != null && b.getShow().getMovie() != null)
                .map(b -> {
                    double seatPrice = b.getShow().getPrice();
                    if (b.getSeatNumber().startsWith("A")) {
                        seatPrice += 450.00;
                    } else if (b.getSeatNumber().startsWith("B")) {
                        seatPrice += 50.00;
                    }
                    return new BookingResponseDTO(
                            b.getId(),
                            b.getShow().getMovie().getTitle(),
                            b.getShow().getShowTime(),
                            seatPrice,
                            b.getSeatNumber(),
                            b.getBookedAt(),
                            b.getShow().getCinema(),
                            b.getShow().getCity(),
                            b.getShow().getDayOffset()
                    );
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/show/{showId}/seats")
    public ResponseEntity<List<String>> getBookedSeats(
            @PathVariable String showId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<Booking> bookings = bookingRepository.findByShowId(showId);
        List<String> bookedSeats = new java.util.ArrayList<>(
            bookings.stream()
                .map(Booking::getSeatNumber)
                .collect(Collectors.toList())
        );


        // Add locks of other users to booked seats list
        List<SeatLock> activeLocks = seatLockRepository.findByShowId(showId);
        Long currentUserId = userPrincipal != null ? userPrincipal.getId() : null;
        for (SeatLock lock : activeLocks) {
            if (currentUserId == null || !lock.getUserId().equals(currentUserId)) {
                if (!bookedSeats.contains(lock.getSeatNumber())) {
                    bookedSeats.add(lock.getSeatNumber());
                }
            }
        }

        return ResponseEntity.ok(bookedSeats);
    }

    @PostMapping("/show/{showId}/lock")
    @Transactional
    public ResponseEntity<String> lockSeat(
            @PathVariable String showId,
            @RequestBody BookingRequestDTO request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        if (userPrincipal == null) {
            return ResponseEntity.status(401).body("Authentication required");
        }

        String seatNumber = request.getSeatNumber();

        // 1. Check if the seat is already booked
        if (bookingRepository.existsByShowIdAndSeatNumber(showId, seatNumber)) {
            return ResponseEntity.status(409).body("Seat is already booked");
        }

        // 2. Check if the seat is already locked by someone else
        java.util.Optional<SeatLock> existingLock = seatLockRepository.findByShowIdAndSeatNumber(showId, seatNumber);
        if (existingLock.isPresent()) {
            SeatLock lock = existingLock.get();
            if (!lock.getUserId().equals(userPrincipal.getId())) {
                return ResponseEntity.status(409).body("Seat is temporarily locked by another user");
            }
            return ResponseEntity.ok("Seat already locked by you");
        }

        // 3. Create lock
        SeatLock newLock = new SeatLock(showId, seatNumber, userPrincipal.getId(), LocalDateTime.now());
        try {
            seatLockRepository.save(newLock);
        } catch (org.springframework.dao.DuplicateKeyException dke) {
            return ResponseEntity.status(409).body("Seat is temporarily locked by another user");
        }

        return ResponseEntity.ok("Seat locked successfully");
    }

    @PostMapping("/show/{showId}/unlock")
    @Transactional
    public ResponseEntity<String> unlockSeat(
            @PathVariable String showId,
            @RequestBody BookingRequestDTO request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        if (userPrincipal == null) {
            return ResponseEntity.status(401).body("Authentication required");
        }

        seatLockRepository.deleteByShowIdAndSeatNumberAndUserId(showId, request.getSeatNumber(), userPrincipal.getId());
        return ResponseEntity.ok("Seat unlocked successfully");
    }

    @GetMapping("/all")
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings() {
        List<BookingResponseDTO> responses = bookingRepository.findAll().stream()
                .filter(b -> b.getShow() != null && b.getShow().getMovie() != null)
                .map(b -> {
                    double seatPrice = b.getShow().getPrice();
                    if (b.getSeatNumber().startsWith("A")) {
                        seatPrice += 450.00;
                    } else if (b.getSeatNumber().startsWith("B")) {
                        seatPrice += 50.00;
                    }
                    return new BookingResponseDTO(
                            b.getId(),
                            b.getShow().getMovie().getTitle(),
                            b.getShow().getShowTime(),
                            seatPrice,
                            b.getSeatNumber(),
                            b.getBookedAt(),
                            b.getShow().getCinema(),
                            b.getShow().getCity(),
                            b.getShow().getDayOffset()
                    );
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }
}
