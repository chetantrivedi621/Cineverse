package com.cineverse.movieservice.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Document(collection = "shows")
public class Show {

    @Id
    private String id;

    @DocumentReference
    private Movie movie;

    @NotBlank
    private String showTime; // e.g. "6:30 PM"

    @NotNull
    private double price;

    @NotBlank
    private String city;

    @NotBlank
    private String cinema;

    @NotNull
    private Integer dayOffset;

    public Show() {
    }

    public Show(Movie movie, String showTime, double price) {
        this.movie = movie;
        this.showTime = showTime;
        this.price = price;
    }

    public Show(Movie movie, String showTime, double price, String city, String cinema, Integer dayOffset) {
        this.movie = movie;
        this.showTime = showTime;
        this.price = price;
        this.city = city;
        this.cinema = cinema;
        this.dayOffset = dayOffset;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Movie getMovie() {
        return movie;
    }

    public void setMovie(Movie movie) {
        this.movie = movie;
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
}
