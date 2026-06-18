package com.cineverse.movieservice.repository;

import com.cineverse.movieservice.entity.SeatLock;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeatLockRepository extends MongoRepository<SeatLock, String> {
    Optional<SeatLock> findByShowIdAndSeatNumber(String showId, String seatNumber);
    List<SeatLock> findByShowId(String showId);
    void deleteByShowIdAndSeatNumberAndUserId(String showId, String seatNumber, Long userId);
    void deleteByUserId(Long userId);
}
