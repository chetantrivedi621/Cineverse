package com.cineverse.movieservice.repository;

import com.cineverse.movieservice.entity.Show;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShowRepository extends MongoRepository<Show, String> {
    List<Show> findByMovieId(String movieId);
    List<Show> findByMovieIdAndCityIgnoreCaseAndDayOffset(String movieId, String city, Integer dayOffset);
    List<Show> findByMovieIdAndCityIgnoreCase(String movieId, String city);
    List<Show> findByMovieIdAndCinemaIgnoreCaseAndCityIgnoreCase(String movieId, String cinema, String city);
}
