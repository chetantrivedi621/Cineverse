package com.cineverse.movieservice.dto;

import java.time.LocalDateTime;

public class BookingResponseDTO {
    private String id;
    private String movieTitle;
    private String showTime;
    private double price;
    private String seatNumber;
    private LocalDateTime bookedAt;
    private String cinema;
    private String city;
    private Integer dayOffset;

    public BookingResponseDTO() {
    }

    public BookingResponseDTO(String id, String movieTitle, String showTime, double price, String seatNumber, LocalDateTime bookedAt) {
        this.id = id;
        this.movieTitle = movieTitle;
        this.showTime = showTime;
        this.price = price;
        this.seatNumber = seatNumber;
        this.bookedAt = bookedAt;
    }

    public BookingResponseDTO(String id, String movieTitle, String showTime, double price, String seatNumber, LocalDateTime bookedAt, String cinema, String city, Integer dayOffset) {
        this.id = id;
        this.movieTitle = movieTitle;
        this.showTime = showTime;
        this.price = price;
        this.seatNumber = seatNumber;
        this.bookedAt = bookedAt;
        this.cinema = cinema;
        this.city = city;
        this.dayOffset = dayOffset;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMovieTitle() {
        return movieTitle;
    }

    public void setMovieTitle(String movieTitle) {
        this.movieTitle = movieTitle;
    }

    public String getShowTime() {
        return showTime;
    }

    public void setShowTime(String showTime) {
        this.showTime = showTime;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
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

    public String getCinema() {
        return cinema;
    }

    public void setCinema(String cinema) {
        this.cinema = cinema;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Integer getDayOffset() {
        return dayOffset;
    }

    public void setDayOffset(Integer dayOffset) {
        this.dayOffset = dayOffset;
    }
}
