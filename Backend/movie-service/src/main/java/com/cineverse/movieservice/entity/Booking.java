package com.cineverse.movieservice.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Document(collection = "bookings")
@CompoundIndex(name = "show_seat_idx", def = "{'show': 1, 'seatNumber': 1}", unique = true)
public class Booking {

    @Id
    private String id;

    @NotNull
    private Long userId;

    @DocumentReference
    private Show show;

    @NotBlank
    private String seatNumber; // e.g. "A1"

    private LocalDateTime bookedAt;

    public Booking() {
    }

    public Booking(Long userId, Show show, String seatNumber, LocalDateTime bookedAt) {
        this.userId = userId;
        this.show = show;
        this.seatNumber = seatNumber;
        this.bookedAt = bookedAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Show getShow() {
        return show;
    }

    public void setShow(Show show) {
        this.show = show;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public LocalDateTime getBookedAt() {
        return bookedAt;
    }

    public void setBookedAt(LocalDateTime bookedAt) {
        this.bookedAt = bookedAt;
    }
}
