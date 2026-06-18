package com.cineverse.movieservice.repository;

import com.cineverse.movieservice.entity.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByShowId(String showId);
    List<Booking> findByUserIdOrderByBookedAtDesc(Long userId);
    boolean existsByShowIdAndSeatNumber(String showId, String seatNumber);
}
