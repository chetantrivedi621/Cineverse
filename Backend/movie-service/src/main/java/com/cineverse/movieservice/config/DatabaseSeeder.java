package com.cineverse.movieservice.config;

import com.cineverse.movieservice.entity.Movie;
import com.cineverse.movieservice.entity.Show;
import com.cineverse.movieservice.repository.BookingRepository;
import com.cineverse.movieservice.repository.MovieRepository;
import com.cineverse.movieservice.repository.ShowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DatabaseSeeder implements ApplicationRunner {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private ShowRepository showRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        removeTestMovies();

        if (movieRepository.count() == 0) {
            System.out.println("Clearing old movies and shows database...");
            showRepository.deleteAll();
            movieRepository.deleteAll();

            System.out.println("Seeding 22 new movies with official posters...");

            List<Movie> moviesToSeed = Arrays.asList(
                // HOLLYWOOD
                new Movie(
                    "Obsession",
                    "Horror, Thriller",
                    8.7,
                    "110 min",
                    "A hopeless romantic wishes for his crush to fall in love with him using a supernatural object, leading to horrifying, violent, and possessive consequences.",
                    "https://upload.wikimedia.org/wikipedia/en/0/05/Obsession_theatrical_poster.jpeg"
                ),
                new Movie(
                    "Dune: Part Two",
                    "Sci-Fi, Action, Adventure",
                    8.6,
                    "166 min",
                    "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
                    "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg"
                ),
                new Movie(
                    "Oppenheimer",
                    "Drama, Historical, Period",
                    8.4,
                    "180 min",
                    "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
                    "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg"
                ),
                new Movie(
                    "Barbie",
                    "Comedy, Fantasy, Romantic",
                    6.9,
                    "114 min",
                    "Stereotypical Barbie experiences a full-on existential crisis and must travel to the real world to find herself.",
                    "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg"
                ),
                new Movie(
                    "Spider-Man: Across the Spider-Verse",
                    "Animation, Action, Sci-Fi",
                    8.6,
                    "140 min",
                    "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
                    "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg"
                ),
                new Movie(
                    "Avatar: The Way of Water",
                    "Action, Adventure, Fantasy",
                    7.6,
                    "192 min",
                    "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns, Jake must work with Neytiri.",
                    "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg"
                ),
                new Movie(
                    "The Batman",
                    "Action, Crime, Mystery, Drama",
                    7.8,
                    "176 min",
                    "Batman ventures into Gotham City's underworld when a sadistic killer leaves behind a trail of cryptic clues.",
                    "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg"
                ),
                new Movie(
                    "Guardians of the Galaxy Vol. 3",
                    "Action, Adventure, Comedy, Sci-Fi",
                    7.9,
                    "150 min",
                    "Still reeling from the loss of Gamora, Peter Quill rallies his team to defend the universe and one of their own.",
                    "https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg"
                ),

                // KIDS
                new Movie(
                    "Inside Out 2",
                    "Animation, Comedy, Fantasy",
                    7.9,
                    "96 min",
                    "Teenager Riley's mind headquarters undergoes a sudden demolition to make room for new Emotions!",
                    "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg"
                ),
                new Movie(
                    "Kung Fu Panda 4",
                    "Animation, Adventure, Comedy",
                    6.3,
                    "94 min",
                    "Po is tapped to become the Spiritual Leader of the Valley of Peace and needs to find and train a new Dragon Warrior.",
                    "https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg"
                ),
                new Movie(
                    "The Super Mario Bros. Movie",
                    "Animation, Adventure, Comedy, Fantasy",
                    7.0,
                    "92 min",
                    "A plumber named Mario travels through an underground labyrinth with his brother, Luigi, trying to save a captured princess.",
                    "https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg"
                ),
                new Movie(
                    "Frozen II",
                    "Animation, Fantasy, Musical",
                    6.8,
                    "103 min",
                    "Anna, Elsa, Kristoff, Olaf and Sven leave Arendelle to travel to an ancient, autumn-bound forest of a land.",
                    "https://image.tmdb.org/t/p/w500/mINJaa34MtknCYl5AjtNJzWj8cD.jpg"
                ),
                new Movie(
                    "Moana 2",
                    "Animation, Adventure, Musical",
                    7.0,
                    "100 min",
                    "After receiving an unexpected call from her wayfinding ancestors, Moana journeys to the far seas of Oceania into dangerous waters.",
                    "https://image.tmdb.org/t/p/w500/m0SbwFNCa9epW1X60deLqTHiP7x.jpg"
                ),
                new Movie(
                    "Despicable Me 4",
                    "Animation, Comedy, Adventure",
                    6.2,
                    "95 min",
                    "Gru, Lucy, Margo, Edith, and Agnes welcome a new member to the family, Gru Jr., who is intent on tormenting his dad.",
                    "https://upload.wikimedia.org/wikipedia/en/e/ed/Despicable_Me_4_Theatrical_Release_Poster.jpeg"
                ),
                new Movie(
                    "Coco",
                    "Animation, Fantasy, Musical",
                    8.4,
                    "105 min",
                    "Aspiring musician Miguel, confronted with his family's ancestral ban on music, enters the Land of the Dead to find his great-great-grandfather.",
                    "https://image.tmdb.org/t/p/w500/6Ryitt95xrO8KXuqRGm1fUuNwqF.jpg"
                ),

                // BOLLYWOOD
                new Movie(
                    "Jawan",
                    "Action, Thriller, Drama",
                    7.0,
                    "168 min",
                    "A high-octane action thriller which outlines the emotional journey of a man who is set to rectify the wrongs in the society.",
                    "https://image.tmdb.org/t/p/w500/mGiw8zAmHQwKBXDG1n7mQpT5kK1.jpg"
                ),
                new Movie(
                    "Pathaan",
                    "Action, Thriller",
                    5.9,
                    "146 min",
                    "An Indian spy takes on the leader of a group of mercenaries who have a heinous plot for his homeland.",
                    "https://image.tmdb.org/t/p/w500/arf00BkwvXo0CFKbaD9OpqdE4Nu.jpg"
                ),
                new Movie(
                    "Animal",
                    "Action, Crime, Drama",
                    6.3,
                    "201 min",
                    "The troubled relationship between a father and his son, set against the backdrop of a violent underworld.",
                    "https://image.tmdb.org/t/p/w500/hr9rjR3J0xBBKmlJ4n3gHId9ccx.jpg"
                ),
                new Movie(
                    "Brahmastra: Part One - Shiva",
                    "Action, Fantasy, Romantic",
                    5.6,
                    "167 min",
                    "Shiva, a young DJ, discovers he has a superpower connection to fire and the ability to awaken the Brahmastra.",
                    "https://upload.wikimedia.org/wikipedia/en/e/ea/Brahmastra_Part_One_Shiva.jpg"
                ),
                new Movie(
                    "RRR",
                    "Action, Drama, Historical",
                    7.8,
                    "187 min",
                    "A fearless warrior and a steely cop in British-ruled India journey together towards an epic clash.",
                    "https://image.tmdb.org/t/p/w500/wE0I6efAW4cDDmZQWtwZMOW44EJ.jpg"
                ),
                new Movie(
                    "Fighter",
                    "Action, Thriller, Drama",
                    6.5,
                    "166 min",
                    "Top IAF aviators come together in the face of imminent danger to form Air Dragons, realizing the true meaning of patriotism.",
                    "https://upload.wikimedia.org/wikipedia/en/d/df/Fighter_film_teaser.jpg"
                ),
                new Movie(
                    "Kalki 2898 AD",
                    "Sci-Fi, Action, Fantasy",
                    7.2,
                    "181 min",
                    "A modern avatar of Vishnu, a Hindu god, is believed to have descended to earth to protect the world from evil forces.",
                    "https://media.themoviedb.org/t/p/w500/rstcAnBeCkxNQjNp3YXrF6IP1tW.jpg"
                )
            );

            for (Movie m : moviesToSeed) {
                m.setId(m.getTitle().toLowerCase().replaceAll("[^a-z0-9]", "-"));
            }
            List<Movie> savedMovies = movieRepository.saveAll(moviesToSeed);

            // Seed Shows for each movie
            String[] times = {
                "03:40 PM", "06:05 PM", "11:30 PM",
                "06:45 PM", "07:50 PM", "09:00 PM", "11:35 PM",
                "02:45 PM", "05:05 PM", "11:20 PM",
                "03:40 PM", "09:05 PM"
            };
            double[] prices = {
                250.00, 270.00, 300.00,
                260.00, 290.00, 280.00, 310.00,
                240.00, 260.00, 290.00,
                250.00, 280.00
            };

            java.util.Map<String, List<String>> cityCinemas = new java.util.HashMap<>();
            cityCinemas.put("Chandigarh", Arrays.asList("PVR: Elante, Chandigarh", "Cinepolis: TDI Mall, Chandigarh", "PVR: Centra Mall, Chandigarh"));
            cityCinemas.put("Mohali", Arrays.asList("PVR: CP67 Mall, Mohali", "Cinepolis: Bestech Square, Mohali", "PVR: MOHALI WALK"));
            cityCinemas.put("Zirakpur", Arrays.asList("PVR: Cosmo Mall, Zirakpur", "INOX: Dhillon Plaza, Zirakpur"));
            cityCinemas.put("Mumbai", Arrays.asList("PVR: Dynamix Mall, Juhu, Mumbai", "Cinepolis: Fun Republic, Andheri, Mumbai", "INOX: Inorbit Mall, Malad, Mumbai"));
            cityCinemas.put("Delhi-NCR", Arrays.asList("PVR: Director's Cut, Ambience Mall, Vasant Kunj", "PVR: Plaza, Connaught Place, Delhi", "Cinepolis: DLF Avenue, Saket, Delhi"));
            cityCinemas.put("Bengaluru", Arrays.asList("PVR: Forum Mall, Koramangala, Bengaluru", "Cinepolis: Royal Meenakshi Mall, Bengaluru", "PVR: Phoenix Marketcity, Whitefield, Bengaluru"));
            cityCinemas.put("Hyderabad", Arrays.asList("PVR: Forum Sujana Mall, Kukatpally, Hyderabad", "Cinepolis: Mantra Mall, Attapur, Hyderabad", "Prasads Multiplex, Hyderabad"));
            cityCinemas.put("Ahmedabad", Arrays.asList("PVR: Acropolis Mall, Ahmedabad", "Cinepolis: Alpha One Mall, Vastrapur, Ahmedabad"));
            cityCinemas.put("Pune", Arrays.asList("PVR: Phoenix Marketcity, Viman Nagar, Pune", "Cinepolis: Westend Mall, Aundh, Pune"));
            cityCinemas.put("Chennai", Arrays.asList("PVR: Ampa Skywalk Mall, Aminjikarai, Chennai", "Sathyam Cinemas: Royapettah, Chennai"));
            cityCinemas.put("Kolkata", Arrays.asList("PVR: Mani Square Mall, Kolkata", "Cinepolis: Acropolis Mall, Kolkata"));
            cityCinemas.put("Kochi", Arrays.asList("PVR: Lulu Mall, Edappally, Kochi", "Cinepolis: Centre Square Mall, Kochi"));

            List<Show> showsToSeed = new java.util.ArrayList<>();
            for (Movie movie : savedMovies) {
                for (String city : cityCinemas.keySet()) {
                    List<String> cinemas = cityCinemas.get(city);
                    for (String cinema : cinemas) {
                        for (int dayOffset = 0; dayOffset < 7; dayOffset++) {
                            String seedStr = movie.getTitle() + "-" + city + "-" + cinema + "-" + dayOffset;
                            int hash = Math.abs(seedStr.hashCode());
                            
                            int count = 2 + (hash % 2); 
                            java.util.Set<Integer> chosenIndices = new java.util.HashSet<>();
                            for (int i = 0; i < count; i++) {
                                int timeIdx = (hash + i * 3) % times.length;
                                while (chosenIndices.contains(timeIdx)) {
                                    timeIdx = (timeIdx + 1) % times.length;
                                }
                                chosenIndices.add(timeIdx);
                                
                                String showTime = times[timeIdx];
                                double price = prices[timeIdx];
                                Show show = new Show(movie, showTime, price, city, cinema, dayOffset);
                                // Generate deterministic unique ID for the show
                                String cleanCinema = cinema.toLowerCase().replaceAll("[^a-z0-9]", "-");
                                String cleanTime = showTime.replace(" ", "").toLowerCase();
                                show.setId(movie.getId() + "-" + city.toLowerCase() + "-" + cleanCinema + "-" + dayOffset + "-" + cleanTime);
                                showsToSeed.add(show);
                            }
                        }
                    }
                }
            }
            showRepository.saveAll(showsToSeed);

            System.out.println("CineVerse movies database successfully seeded with 22 new movies!");
        }
    }

    private void removeTestMovies() {
        List<Movie> testMovies = movieRepository.findAll().stream()
                .filter(movie -> {
                    String title = movie.getTitle() == null ? "" : movie.getTitle().trim().toLowerCase();
                    String genre = movie.getGenre() == null ? "" : movie.getGenre().trim().toLowerCase();
                    return title.equals("test")
                            || title.equals("test movie")
                            || title.equals("persist testing")
                            || title.startsWith("test ")
                            || title.contains(" testing")
                            || genre.equals("testing");
                })
                .toList();

        for (Movie movie : testMovies) {
            List<Show> shows = showRepository.findByMovieId(movie.getId());
            for (Show show : shows) {
                bookingRepository.deleteAll(bookingRepository.findByShowId(show.getId()));
                showRepository.delete(show);
            }
            movieRepository.delete(movie);
            System.out.println("Removed test movie from catalog: " + movie.getTitle());
        }
    }
}
