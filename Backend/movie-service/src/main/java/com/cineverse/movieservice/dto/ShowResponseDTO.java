package com.cineverse.movieservice.dto;

public class ShowResponseDTO {
    private String id;
    private String showTime;
    private double price;
    private String city;
    private String cinema;
    private Integer dayOffset;
    private java.util.List<String> bookedSeats;

    public ShowResponseDTO() {
    }

    public ShowResponseDTO(String id, String showTime, double price) {
        this.id = id;
        this.showTime = showTime;
        this.price = price;
    }

    public ShowResponseDTO(String id, String showTime, double price, String city, String cinema, Integer dayOffset) {
        this.id = id;
        this.showTime = showTime;
        this.price = price;
        this.city = city;
        this.cinema = cinema;
        this.dayOffset = dayOffset;
    }

    public ShowResponseDTO(String id, String showTime, double price, String city, String cinema, Integer dayOffset, java.util.List<String> bookedSeats) {
        this.id = id;
        this.showTime = showTime;
        this.price = price;
        this.city = city;
        this.cinema = cinema;
        this.dayOffset = dayOffset;
        this.bookedSeats = bookedSeats;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCinema() {
        return cinema;
    }

    public void setCinema(String cinema) {
        this.cinema = cinema;
    }

    public Integer getDayOffset() {
        return dayOffset;
    }

    public void setDayOffset(Integer dayOffset) {
        this.dayOffset = dayOffset;
    }

    public java.util.List<String> getBookedSeats() {
        return bookedSeats;
    }

    public void setBookedSeats(java.util.List<String> bookedSeats) {
        this.bookedSeats = bookedSeats;
    }
}
