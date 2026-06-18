import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import { getMovies } from "../services/api";
import "./Movies.css";

// The static list of genres from BookMyShow filter
const FILTER_GENRES = [
  "Drama",
  "Comedy",
  "Romantic",
  "Thriller",
  "Adventure",
  "Horror",
  "Action",
  "Sci-Fi",
  "Historical",
  "Musical",
  "Period",
  "Sports",
  "Animation",
  "Crime",
  "Devotional",
  "Fantasy",
  "Mystery"
];

function Movies() {
  const [movies, setMovies] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [isGenresOpen, setIsGenresOpen] = useState(true);

  useEffect(() => {
    getMovies().then(setMovies);
  }, []);

  const handleSearchChange = (value) => {
    if (value) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };

  // Toggle genre selection
  const handleGenreToggle = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  // Clear all genre filters
  const handleClearFilters = () => {
    setSelectedGenres([]);
  };

  // Filter logic
  const filteredMovies = movies.filter((movie) => {
    // Search match
    const matchesSearch = 
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (movie.description && movie.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Genre match (multi-select: matches at least one of selected genres, or matches all if none selected)
    let matchesGenre = true;
    if (selectedGenres.length > 0) {
      if (!movie.genre) {
        matchesGenre = false;
      } else {
        // movie.genre is comma-separated, e.g. "Sci-Fi, Action"
        const movieGenresList = movie.genre.split(",").map((g) => g.trim().toLowerCase());
        matchesGenre = selectedGenres.some((selectedG) => 
          movieGenresList.includes(selectedG.toLowerCase())
        );
      }
    }
    
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="movies-page-container">
      <Navbar />

      <main className="movies-page-content">
        <header className="movies-page-header">
          <span className="movies-eyebrow">Discover</span>
          <h1>Explore Cinematic Wonders</h1>
          <p className="movies-desc">
            Search movies, filter by your favorite genres, and secure the best seats in the theater instantly.
          </p>
        </header>

        {/* Layout Grid: Sidebar + Main Content */}
        <div className="movies-layout-grid">
          
          {/* Left Sidebar Filters Panel */}
          <aside className="movies-sidebar">
            <div className="sidebar-filter-card">
              <div 
                className="filter-card-header" 
                onClick={() => setIsGenresOpen(!isGenresOpen)}
              >
                <span className={`chevron-icon ${isGenresOpen ? "open" : ""}`}>▲</span>
                <h3>Genres</h3>
                {selectedGenres.length > 0 && (
                  <button 
                    className="clear-filter-btn" 
                    onClick={(e) => { e.stopPropagation(); handleClearFilters(); }}
                  >
                    Clear
                  </button>
                )}
              </div>
              
              {isGenresOpen && (
                <div className="filter-card-body">
                  <div className="genres-grid-container">
                    {FILTER_GENRES.map((genre) => {
                      const isActive = selectedGenres.includes(genre);
                      return (
                        <button
                          key={genre}
                          className={`sidebar-genre-chip ${isActive ? "active" : ""}`}
                          onClick={() => handleGenreToggle(genre)}
                        >
                          {genre}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Right Main Content */}
          <div className="movies-main-section">
            {/* Search Input Bar */}
            <div className="search-bar-wrapper">
              <span className="search-icon">
                <svg stroke="currentColor" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.1em" width="1.1em" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search movie title, description, cast..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="search-input"
              />
            </div>

            {/* Movies Display Grid */}
            <section className="movies-display-section">
              {filteredMovies.length === 0 ? (
                <div className="no-movies-found">
                  <span className="no-movies-icon">
                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="2.5em" width="2.5em" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                      <line x1="7" y1="2" x2="7" y2="22"></line>
                      <line x1="17" y1="2" x2="17" y2="22"></line>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <line x1="2" y1="7" x2="7" y2="7"></line>
                      <line x1="2" y1="17" x2="7" y2="17"></line>
                      <line x1="17" y1="17" x2="22" y2="17"></line>
                      <line x1="17" y1="7" x2="22" y2="7"></line>
                    </svg>
                  </span>
                  <h3>No Movies Match Your Criteria</h3>
                  <p>Try searching for something else or resetting the genre filters.</p>
                  <button 
                    className="reset-btn"
                    onClick={() => { handleSearchChange(""); handleClearFilters(); }}
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="movies-grid">
                  {filteredMovies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Movies;
