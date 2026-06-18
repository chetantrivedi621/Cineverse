package com.cineverse.movieservice.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Document(collection = "seat_locks")
@CompoundIndex(name = "show_seat_lock_idx", def = "{'showId': 1, 'seatNumber': 1}", unique = true)
public class SeatLock {

    @Id
    private String id;

    @NotBlank
    private String showId;

    @NotBlank
    private String seatNumber;

    @NotNull
    private Long userId;

    @Indexed(expireAfterSeconds = 120)
    private LocalDateTime createdAt;

    public SeatLock() {
    }

    public SeatLock(String showId, String seatNumber, Long userId, LocalDateTime createdAt) {
        this.showId = showId;
        this.seatNumber = seatNumber;
        this.userId = userId;
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getShowId() {
        return showId;
    }

    public void setShowId(String showId) {
        this.showId = showId;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
