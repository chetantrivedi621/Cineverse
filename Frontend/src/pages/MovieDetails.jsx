import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getMovieById } from "../services/api";
import "./MovieDetails.css";

// Helper function to get realistic details based on movie title and genre
const getMovieMetadata = (title, genre) => {
  const t = title.toLowerCase();
  
  let subGenres = genre;
  let certificate = "UA";
  let languages = "English";
  let formats = "2D, IMAX 2D";
  let releaseDate = "15 May, 2026";
  let totalVotes = "120K+ Votes";

  if (t.includes("obsession")) {
    subGenres = "Horror, Thriller";
    certificate = "A";
    languages = "English";
    formats = "2D, EPIQ, DOLBY CINEMA 2D";
    releaseDate = "29 May, 2026";
    totalVotes = "66.1K+ Votes";
  } else if (t.includes("dune")) {
    subGenres = "Sci-Fi, Action, Adventure";
    certificate = "UA";
    languages = "English, Hindi";
    formats = "2D, 3D, IMAX 2D, IMAX 3D, 4DX";
    releaseDate = "01 Mar, 2026";
    totalVotes = "240.5K+ Votes";
  } else if (t.includes("oppenheimer")) {
    subGenres = "Biography, Drama, History";
    certificate = "UA";
    languages = "English";
    formats = "2D, IMAX 2D";
    releaseDate = "21 Jul, 2025";
    totalVotes = "450K+ Votes";
  } else if (t.includes("barbie")) {
    subGenres = "Comedy, Fantasy, Family";
    certificate = "UA";
    languages = "English";
    formats = "2D";
    releaseDate = "21 Jul, 2025";
    totalVotes = "310K+ Votes";
  } else if (t.includes("spider-man")) {
    subGenres = "Animation, Action, Sci-Fi";
    certificate = "U";
    languages = "English, Hindi, Tamil, Telugu";
    formats = "2D, 3D, 4DX";
    releaseDate = "02 Jun, 2025";
    totalVotes = "180.2K+ Votes";
  } else if (t.includes("avatar")) {
    subGenres = "Action, Adventure, Sci-Fi";
    certificate = "UA";
    languages = "English, Hindi, Tamil, Telugu, Malayalam";
    formats = "2D, 3D, IMAX 3D, 4DX 3D";
    releaseDate = "16 Dec, 2024";
    totalVotes = "890K+ Votes";
  } else if (t.includes("the batman")) {
    subGenres = "Action, Crime, Drama";
    certificate = "UA";
    languages = "English";
    formats = "2D, IMAX 2D";
    releaseDate = "04 Mar, 2024";
    totalVotes = "350K+ Votes";
  } else if (t.includes("inside out")) {
    subGenres = "Animation, Family, Comedy";
    certificate = "U";
    languages = "English, Hindi";
    formats = "2D, 3D";
    releaseDate = "14 Jun, 2026";
    totalVotes = "95K+ Votes";
  } else if (t.includes("coco")) {
    subGenres = "Animation, Family, Fantasy";
    certificate = "U";
    languages = "English, Hindi";
    formats = "2D";
    releaseDate = "22 Nov, 2023";
    totalVotes = "150K+ Votes";
  } else if (t.includes("jawan")) {
    subGenres = "Action, Thriller, Drama";
    certificate = "UA";
    languages = "Hindi, Tamil, Telugu";
    formats = "2D, IMAX 2D, 4DX";
    releaseDate = "07 Sep, 2025";
    totalVotes = "780K+ Votes";
  } else if (t.includes("pathaan")) {
    subGenres = "Action, Thriller";
    certificate = "UA";
    languages = "Hindi, Tamil, Telugu";
    formats = "2D, IMAX 2D";
    releaseDate = "25 Jan, 2025";
    totalVotes = "620K+ Votes";
  } else if (t.includes("animal")) {
    subGenres = "Action, Crime, Drama";
    certificate = "A";
    languages = "Hindi, Telugu, Tamil, Malayalam";
    formats = "2D";
    releaseDate = "01 Dec, 2025";
    totalVotes = "890.3K+ Votes";
  } else if (genre === "Kids") {
    subGenres = "Animation, Adventure, Family";
    certificate = "U";
    languages = "English, Hindi";
    formats = "2D, 3D";
    releaseDate = "12 Dec, 2025";
    totalVotes = "40K+ Votes";
  } else if (genre === "Bollywood") {
    subGenres = "Action, Drama, Romance";
    certificate = "UA";
    languages = "Hindi";
    formats = "2D";
    releaseDate = "26 Jan, 2026";
    totalVotes = "150K+ Votes";
  }

  return { subGenres, certificate, languages, formats, releaseDate, totalVotes };
};

// Helper function to generate dynamic reviews
const getMovieReviewsData = (title, genre) => {
  let chips = [
    { label: "#GreatActing", count: 16747 },
    { label: "#SuperDirection", count: 14164 },
    { label: "#Wellmade", count: 11633 },
    { label: "#AwesomeStory", count: 8774 },
    { label: "#MustWatch", count: 5421 }
  ];

  let reviewsList = [];
  const t = title.toLowerCase();

  if (t.includes("obsession")) {
    chips = [
      { label: "#GreatActing", count: 1245 },
      { label: "#SuperDirection", count: 980 },
      { label: "#Supernatural", count: 865 },
      { label: "#AwesomeStory", count: 720 },
      { label: "#ScaryAtmosphere", count: 642 }
    ];
    reviewsList = [
      {
        id: 1,
        user: "Anshul",
        rating: 9,
        booked: true,
        tags: ["#SuperDirection", "#GreatActing", "#AwesomeStory"],
        content: "Just saw the movie & I'd say it is one of the best Horror Movie of this Year till date. The way the story slowly becomes Chilling & Gruesome is simply outstanding. The acting is extremely believable and tense.",
        likes: "2.1K",
        daysAgo: 16
      },
      {
        id: 2,
        user: "User",
        rating: 10,
        booked: true,
        tags: ["#SuperDirection", "#GreatActing", "#WowMusic"],
        content: "I watched this horror-thriller and found it quite engaging. The movie does a good job of building tension and keeping the audience curious about what's going to happen next. Definitely a must-watch!",
        likes: "600",
        daysAgo: 16
      },
      {
        id: 3,
        user: "Vikram",
        rating: 8,
        booked: false,
        tags: ["#Supernatural", "#EdgeOfSeat"],
        content: "Really good psychological horror! The One Wish Willow concept is super eerie. It doesn't rely on cheap jump scares but builds a very creepy atmosphere that sticks with you.",
        likes: "571",
        daysAgo: 12
      }
    ];
  } else if (t.includes("dune")) {
    chips = [
      { label: "#VisualMasterpiece", count: 18452 },
      { label: "#EpicDirection", count: 15302 },
      { label: "#AmazingSoundtrack", count: 14112 },
      { label: "#MustWatchInIMAX", count: 12894 },
      { label: "#GreatActing", count: 9553 }
    ];
    reviewsList = [
      {
        id: 1,
        user: "ArrakisFan",
        rating: 10,
        booked: true,
        tags: ["#VisualMasterpiece", "#EpicDirection", "#MustWatchInIMAX"],
        content: "An absolute masterclass in filmmaking. Denis Villeneuve has created a legendary sci-fi epic. The visual scale and Hans Zimmer's soundtrack are mind-blowing.",
        likes: "4.8K",
        daysAgo: 5
      },
      {
        id: 2,
        user: "Rahul S.",
        rating: 9,
        booked: true,
        tags: ["#GreatActing", "#EpicDirection"],
        content: "Timothée Chalamet and Zendaya have incredible chemistry. The cinematography is breathtaking. It's a long movie but every second feels justified and epic.",
        likes: "1.2K",
        daysAgo: 8
      },
      {
        id: 3,
        user: "Sarah",
        rating: 10,
        booked: true,
        tags: ["#VisualMasterpiece", "#AmazingSoundtrack"],
        content: "The best science fiction film of the decade. The worldbuilding is so rich and deep. I've watched it twice in theaters already!",
        likes: "942",
        daysAgo: 10
      }
    ];
  } else if (t.includes("inside out")) {
    chips = [
      { label: "#Heartwarming", count: 8740 },
      { label: "#SuperbAnimation", count: 7652 },
      { label: "#VeryEmotional", count: 6412 },
      { label: "#GreatForKids", count: 5930 },
      { label: "#AwesomeStory", count: 4210 }
    ];
    reviewsList = [
      {
        id: 1,
        user: "Priya",
        rating: 10,
        booked: true,
        tags: ["#Heartwarming", "#VeryEmotional"],
        content: "A beautiful, touching, and incredibly smart sequel. It handles teenage emotions, especially Anxiety, with so much care and humor. Kids and adults alike will love it.",
        likes: "1.9K",
        daysAgo: 3
      },
      {
        id: 2,
        user: "KidAtHeart",
        rating: 9,
        booked: true,
        tags: ["#SuperbAnimation", "#GreatForKids"],
        content: "Pixar at its peak. The new emotions are fantastic additions and the animation is vibrant and stunning. I laughed and cried. Highly recommended!",
        likes: "820",
        daysAgo: 4
      },
      {
        id: 3,
        user: "Amit K.",
        rating: 8,
        booked: true,
        tags: ["#Heartwarming", "#AwesomeStory"],
        content: "A very relatable film for parents. It beautifully depicts what goes on in a teenager's mind. The voice acting is spot on.",
        likes: "340",
        daysAgo: 6
      }
    ];
  } else if (t.includes("coco")) {
    chips = [
      { label: "#Heartwarming", count: 9870 },
      { label: "#BeautifulMusic", count: 8940 },
      { label: "#Masterpiece", count: 7520 },
      { label: "#VeryEmotional", count: 6920 },
      { label: "#GreatForKids", count: 5410 }
    ];
    reviewsList = [
      {
        id: 1,
        user: "MiguelFan",
        rating: 10,
        booked: true,
        tags: ["#Masterpiece", "#BeautifulMusic"],
        content: "Coco is a masterpiece. The music (Remember Me) is beautiful, and the portrayal of family and Day of the Dead is deeply moving. Cry every single time.",
        likes: "3.2K",
        daysAgo: 25
      },
      {
        id: 2,
        user: "Rohan",
        rating: 10,
        booked: false,
        tags: ["#Heartwarming", "#VeryEmotional"],
        content: "One of Pixar's absolute best works. The colors in the Land of the Dead are stunning. The ending is one of the most emotional moments in cinema history.",
        likes: "1.5K",
        daysAgo: 20
      }
    ];
  } else if (t.includes("jawan")) {
    chips = [
      { label: "#Blockbuster", count: 14750 },
      { label: "#MassEntertainer", count: 12890 },
      { label: "#ActionPacked", count: 11450 },
      { label: "#GreatMusic", count: 8740 },
      { label: "#SuperDirection", count: 7520 }
    ];
    reviewsList = [
      {
        id: 1,
        user: "SRKian",
        rating: 10,
        booked: true,
        tags: ["#Blockbuster", "#MassEntertainer", "#ActionPacked"],
        content: "SRK is at his absolute best! The action scenes are Hollywood level, the background music by Anirudh is top-notch, and the story has a great social message. A complete package!",
        likes: "5.4K",
        daysAgo: 30
      },
      {
        id: 2,
        user: "Gaurav",
        rating: 8,
        booked: true,
        tags: ["#ActionPacked", "#SuperDirection"],
        content: "High-octane action thriller! Atlee's direction is fantastic and Vijay Sethupathi makes an incredible villain. Highly entertaining from start to finish.",
        likes: "2.1K",
        daysAgo: 28
      }
    ];
  } else if (t.includes("pathaan")) {
    chips = [
      { label: "#ActionPacked", count: 13210 },
      { label: "#Blockbuster", count: 11840 },
      { label: "#MassEntertainer", count: 9540 },
      { label: "#GreatMusic", count: 7420 },
      { label: "#SuperDirection", count: 6410 }
    ];
    reviewsList = [
      {
        id: 1,
        user: "Aman",
        rating: 9,
        booked: true,
        tags: ["#Blockbuster", "#ActionPacked"],
        content: "The return of the King! The spy universe is expanding beautifully. John Abraham as Jim was phenomenal and Deepika was brilliant. A pure cinematic ride.",
        likes: "3.7K",
        daysAgo: 35
      },
      {
        id: 2,
        user: "Neha",
        rating: 8,
        booked: true,
        tags: ["#MassEntertainer", "#GreatMusic"],
        content: "Jhoomme Jo Pathaan! Music and background score are super catchy. Action is loud and over the top, but SRK's charm makes it an absolute blast.",
        likes: "1.4K",
        daysAgo: 34
      }
    ];
  } else if (t.includes("animal")) {
    chips = [
      { label: "#GreatActing", count: 18450 },
      { label: "#IntenseViolence", count: 15420 },
      { label: "#Blockbuster", count: 14210 },
      { label: "#MassEntertainer", count: 11840 },
      { label: "#GreatSoundtrack", count: 9640 }
    ];
    reviewsList = [
      {
        id: 1,
        user: "RanbirFan",
        rating: 10,
        booked: true,
        tags: ["#Blockbuster", "#GreatActing", "#MassEntertainer"],
        content: "Ranbir Kapoor's performance is legendary. The raw emotion, violence, and intense acting keep you glued for over 3 hours. The soundtrack is perfect.",
        likes: "7.1K",
        daysAgo: 22
      },
      {
        id: 2,
        user: "Kabir",
        rating: 7,
        booked: true,
        tags: ["#GreatActing", "#ActionPacked"],
        content: "Extremely intense and violent film. It might not be for everyone, but there's no denying Ranbir's stellar performance. Bobby Deol's entry scene is iconic.",
        likes: "3.2K",
        daysAgo: 20
      }
    ];
  } else {
    // Default fallback based on genre
    const isBollywood = genre === "Bollywood";
    const isKids = genre === "Kids";
    
    if (isKids) {
      chips = [
        { label: "#GreatForKids", count: 3241 },
        { label: "#Funny", count: 2840 },
        { label: "#Heartwarming", count: 2110 },
        { label: "#AwesomeStory", count: 1840 },
        { label: "#BeautifulMusic", count: 1205 }
      ];
      reviewsList = [
        {
          id: 1,
          user: "FamilyMovieNight",
          rating: 9,
          booked: true,
          tags: ["#GreatForKids", "#Funny"],
          content: "My children absolutely loved it! It has a very sweet message, wonderful characters, and lots of laughs for parents too.",
          likes: "450",
          daysAgo: 10
        },
        {
          id: 2,
          user: "DisneyFan",
          rating: 8,
          booked: true,
          tags: ["#Heartwarming", "#AwesomeStory"],
          content: "Such a beautiful and magical movie. The animation is top-notch and the story is very engaging. Great watch for everyone.",
          likes: "210",
          daysAgo: 12
        }
      ];
    } else if (isBollywood) {
      chips = [
        { label: "#MassEntertainer", count: 4210 },
        { label: "#AwesomeMusic", count: 3890 },
        { label: "#GreatActing", count: 3512 },
        { label: "#SuperDirection", count: 2901 },
        { label: "#Blockbuster", count: 2410 }
      ];
      reviewsList = [
        {
          id: 1,
          user: "DesiCinema",
          rating: 9,
          booked: true,
          tags: ["#MassEntertainer", "#AwesomeMusic"],
          content: "A solid Bollywood entertainer! Songs are great, performance of the lead actors is superb, and it keeps you hooked till the end.",
          likes: "670",
          daysAgo: 8
        },
        {
          id: 2,
          user: "Kriti",
          rating: 8,
          booked: true,
          tags: ["#GreatActing", "#SuperDirection"],
          content: "Very engaging storyline with emotional beats. The acting was wonderful and the production values are very high.",
          likes: "320",
          daysAgo: 9
        }
      ];
    } else {
      // Hollywood default
      reviewsList = [
        {
          id: 1,
          user: "Cinephile",
          rating: 9,
          booked: true,
          tags: ["#SuperDirection", "#GreatActing"],
          content: "An exceptional piece of cinema. The storytelling is tight, the pacing is excellent, and the performances are top-tier.",
          likes: "890",
          daysAgo: 7
        },
        {
          id: 2,
          user: "Alex",
          rating: 8,
          booked: false,
          tags: ["#AwesomeStory", "#MustWatch"],
          content: "Loved it! It keeps you guessing from start to finish. The direction is clean and the cast does a brilliant job.",
          likes: "430",
          daysAgo: 9
        }
      ];
    }
  }

  return { chips, reviewsList };
};

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAgeModal, setShowAgeModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    getMovieById(id)
      .then((data) => {
        setMovie(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch movie details:", err);
        setError("Could not load movie details.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="movie-details-loading">
        <Navbar />
        <div className="loading-spinner-container">
          <div className="spinner"></div>
          <p>Loading cinematic details...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="movie-details-error">
        <Navbar />
        <div className="error-card">
          <h2>Oops! Movie Not Found</h2>
          <p>{error || "The movie you are looking for does not exist or has been removed."}</p>
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            Go Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const metadata = getMovieMetadata(movie.title, movie.genre);
  
  const { chips, reviewsList: mockReviews } = getMovieReviewsData(movie.title, movie.genre);
  
  // Load custom user reviews from localStorage
  const savedReviews = JSON.parse(localStorage.getItem("user_reviews") || "[]");
  const movieCustomReviews = savedReviews.filter(
    (r) => r.movieTitle.toLowerCase() === movie.title.toLowerCase() && !r.isSpam
  );
  
  const customReviewsMapped = movieCustomReviews.map((r) => ({
    id: r.id,
    user: r.author.split("@")[0],
    rating: r.rating * 2,
    booked: true,
    tags: r.rating >= 4 ? ["#MustWatch", "#HonestReview"] : ["#Average", "#HonestReview"],
    content: r.comment,
    likes: "1",
    daysAgo: 0
  }));

  const reviewsList = [...customReviewsMapped, ...mockReviews];

  const handleBookTickets = () => {
    if (metadata.certificate === "A") {
      setShowAgeModal(true);
    } else {
      proceedToBooking();
    }
  };

  const handleRateNow = () => {
    navigate("/dashboard?tab=reviews");
  };

  const proceedToBooking = () => {
    navigate("/booking", { state: { movieId: movie.id } });
  };

  return (
    <div className="movie-details-page">
      <Navbar />

      {/* Hero Movie Details Section */}
      <div className="movie-hero-section">
        {/* Backdrop Blurred Background */}
        <div 
          className="movie-hero-backdrop" 
          style={{ backgroundImage: `url(${movie.imageUrl || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba"})` }}
        ></div>
        <div className="movie-hero-overlay"></div>

        {/* Content Layout */}
        <div className="movie-hero-content">
          <div className="movie-poster-card">
            <img 
              src={movie.imageUrl || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba"} 
              alt={movie.title} 
              className="details-movie-poster"
            />
            <div className="poster-footer-badge">In cinemas</div>
          </div>

          <div className="movie-details-text-panel">
            <h1 className="details-movie-title">{movie.title}</h1>
            
            {/* Ratings Card Section */}
            <div className="details-ratings-card">
              <div className="rating-score-row">
                <span className="rating-star">★</span>
                <span className="rating-score">{movie.rating ? movie.rating.toFixed(1) : "N/A"}/10</span>
                <span className="rating-votes">({metadata.totalVotes})</span>
                <span className="rating-arrow">&gt;</span>
              </div>
              <button className="btn-rate-now" onClick={handleRateNow}>Rate now</button>
            </div>

            {/* Movie Meta Information */}
            <div className="details-meta-row">
              <span className="meta-item">{movie.duration || "N/A"}</span>
              <span className="meta-dot">•</span>
              <span className="meta-item">{metadata.subGenres}</span>
              <span className="meta-dot">•</span>
              <span className="meta-item badge-certificate">{metadata.certificate}</span>
              <span className="meta-dot">•</span>
              <span className="meta-item">{metadata.releaseDate}</span>
            </div>

            {/* Formats and Languages */}
            <div className="details-formats-row">
              <span className="format-tag">{metadata.formats}</span>
              <span className="language-tag">{metadata.languages}</span>
            </div>

            {/* Action Call to Book Tickets */}
            <div className="details-booking-actions">
              <button className="btn-book-tickets" onClick={handleBookTickets}>
                Book tickets
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Page Layout (Description and Reviews) */}
      <div className="details-main-layout">
        <div className="details-left-column">
          {/* About Section */}
          <section className="about-movie-section">
            <h2 className="details-section-title">About the movie</h2>
            <p className="details-movie-description">
              {movie.description || "No description available for this movie."}
            </p>
          </section>

          <div className="section-divider"></div>

          {/* Reviews Section */}
          <section className="reviews-movie-section">
            <div className="reviews-section-header">
              <h2 className="details-section-title">Top reviews</h2>
              <span className="reviews-total-count">25.7K reviews &gt;</span>
            </div>
            <p className="reviews-subtitle">Summary of 25.7K reviews.</p>

            {/* Review Chips Sentiment Summaries */}
            <div className="reviews-chips-container">
              {chips.map((chip, idx) => (
                <div key={idx} className="review-hashtag-chip">
                  <span className="chip-hashtag">{chip.label}</span>
                  <span className="chip-count">{chip.count}</span>
                </div>
              ))}
            </div>

            {/* Horizontal Scrollable User Reviews */}
            <div className="reviews-carousel-wrapper">
              <div className="reviews-carousel-list">
                {reviewsList.map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-card-header">
                      <div className="review-user-info">
                        <div className="user-avatar-circle">
                          {review.user.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-name-meta">
                          <span className="reviewer-name">{review.user}</span>
                          {review.booked && (
                            <span className="reviewer-booked-tag">
                              Booked on <span className="logo-text">CineVerse</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="review-star-rating">
                        <span className="star-icon">★</span>
                        <span className="rating-val">{review.rating}/10</span>
                      </div>
                    </div>

                    <div className="review-hashtags-row">
                      {review.tags.map((tag, i) => (
                        <span key={i} className="review-tag-hashtag">{tag}</span>
                      ))}
                    </div>

                    <p className="review-text-content">
                      {review.content} <span className="text-more">...more</span>
                    </p>

                    <div className="review-card-footer">
                      <div className="review-actions-left">
                        <button className="review-action-btn btn-like">
                          <span className="icon">
                            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                            </svg>
                          </span> {review.likes}
                        </button>
                        <button className="review-action-btn btn-comment">
                          <span className="icon">
                            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                          </span>
                        </button>
                      </div>
                      <div className="review-meta-right">
                        <span className="review-time">{review.daysAgo} Days ago</span>
                        <button className="review-action-btn btn-share">
                          <span className="icon">
                            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                            </svg>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      {showAgeModal && (
        <div className="age-modal-overlay">
          <div className="age-modal-card">
            <h2 className="age-modal-title">This movie is rated "A"</h2>
            <div className="age-modal-content">
              <div className="age-circle">
                <span>18+</span>
              </div>
              <p className="age-text">
                This movie is only for viewers above 18. Please carry a valid ID/Age Proof to the theatre. If you are denied entry due to age or ID issues, you will not get a refund.
              </p>
            </div>
            <button className="btn-age-continue" onClick={() => { setShowAgeModal(false); proceedToBooking(); }}>
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetails;
