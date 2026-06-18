import { useNavigate } from "react-router-dom";
import "./MovieCard.css";

function MovieCard({ movie }) {
  const navigate = useNavigate();
  if (!movie) return null;
  const { id, title, rating, genre, duration, imageUrl } = movie;

  const handleCardClick = () => {
    navigate(`/movie/${id}`);
  };

  return (
    <div className="movie-card" onClick={handleCardClick}>
      <div className="movie-poster-container">
        <img
          src={imageUrl || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba"}
          alt={title}
          className="movie-poster"
          loading="lazy"
        />
        <div className="movie-card-overlay">
          <span className="movie-genre-badge">{genre}</span>
        </div>
        {duration && <span className="movie-duration-badge">{duration}</span>}
      </div>

      <div className="movie-info">
        <h3 className="movie-title">{title}</h3>
        <div className="movie-meta">
          <span className="movie-rating">★ {rating ? rating.toFixed(1) : "N/A"}</span>
          <button className="card-book-btn">Book Now</button>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;