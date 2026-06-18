import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getTrendingMovies } from "../services/api";
import "./Landing.css";

function Landing() {
  const navigate = useNavigate();
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrendingMovies()
      .then((data) => {
        setTrendingMovies(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch trending movies:", err);
        setLoading(false);
      });
  }, []);

  const offers = [
    {
      id: 1,
      title: "Welcome Offer",
      desc: "Get 50% off up to ₹150 on your first booking.",
      code: "CINEFIRST50",
      badge: "NEW USER",
      color: "linear-gradient(135deg, #f35588, #7f22fd)"
    },
    {
      id: 2,
      title: "Blockbuster Weekends",
      desc: "Flat ₹100 off on purchasing 2 or more tickets.",
      code: "WEEKEND100",
      badge: "WEEKENDS ONLY",
      color: "linear-gradient(135deg, #ff5e36, #ffaf38)"
    },
    {
      id: 3,
      title: "Snack Combo Discount",
      desc: "Pre-book popcorn & beverage combos and save 30%.",
      code: "SNACK30",
      badge: "FOOD DEALS",
      color: "linear-gradient(135deg, #05c1ff, #3922fa)"
    }
  ];

  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" height="2em" width="2em">
          <circle cx="12" cy="12" r="10"/>
          <path d="M10 9l5 3-5 3z"/>
        </svg>
      ),
      title: "Ultra HD & IMAX Screenings",
      desc: "Experience cinema like never before with crystal-clear IMAX digital projection and vibrant lasers."
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" height="2em" width="2em">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
        </svg>
      ),
      title: "Dolby Atmos Surround Sound",
      desc: "Feel the sound move all around you with breath-taking multidimensional acoustics."
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" height="2em" width="2em">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      ),
      title: "Secure & Contactless Entry",
      desc: "Skip long lines. Flash your custom booking QR code at the ticket gate for paperless, instant entry."
    }
  ];

  return (
    <div className="landing-page-container">
      <Navbar />

      {/* Hero Header Section */}
      <header className="landing-hero-section">
        <div className="hero-backdrop-gradient"></div>
        <div className="hero-content-wrapper">
          <div className="hero-glass-card animate-slide-up">
            <span className="hero-badge">🎬 CINEVERSE HUB</span>
            <h1 className="hero-title">
              Your Gateway to <br />
              <span className="text-highlight-gradient">Cinematic Wonders</span>
            </h1>
            <p className="hero-description">
              Discover blockbusters, book seats with interactive custom maps, and manage showtimes instantly on the country's premium ticketing portal.
            </p>
            <div className="hero-buttons-row">
              <button 
                className="hero-btn-primary" 
                onClick={() => navigate("/login")}
              >
                Get Started
              </button>
              <button 
                className="hero-btn-secondary" 
                onClick={() => navigate("/login")}
              >
                Browse Movies
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Trending Movies Section */}
      <section className="landing-movies-section">
        <div className="section-container">
          <div className="section-header">
            <div>
              <span className="section-subtitle">Now Showing</span>
              <h2 className="section-title">Trending Blockbusters</h2>
            </div>
            <button 
              className="view-all-link-btn" 
              onClick={() => navigate("/login")}
            >
              View All Movies →
            </button>
          </div>

          {loading ? (
            <div className="trending-loading-spinner">
              <div className="spinner-ring"></div>
            </div>
          ) : trendingMovies.length === 0 ? (
            <div className="no-movies-alert-box">
              <p>Unable to load trending movies. Check back shortly!</p>
            </div>
          ) : (
            <div className="trending-movies-grid">
              {trendingMovies.map((movie) => (
                <div 
                  key={movie.id} 
                  className="landing-movie-card"
                  onClick={() => navigate("/login")}
                >
                  <div className="card-image-wrapper">
                    <img src={movie.imageUrl} alt={movie.title} className="movie-card-img" />
                    <div className="card-rating-badge">★ {movie.rating.toFixed(1)}</div>
                  </div>
                  <div className="card-info-block">
                    <h3 className="movie-card-title">{movie.title}</h3>
                    <span className="movie-card-genre">{movie.genre}</span>
                    <span className="movie-card-duration">🕒 {movie.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Promo Offers Section */}
      <section className="landing-offers-section">
        <div className="section-container">
          <div className="section-header text-center">
            <span className="section-subtitle">Exclusive Perks</span>
            <h2 className="section-title">Deals & Offers For You</h2>
            <p className="section-desc-para">Enjoy these limited-time deals when booking your tickets on CineVerse.</p>
          </div>

          <div className="offers-cards-grid">
            {offers.map((offer) => (
              <div 
                key={offer.id} 
                className="offer-promo-card"
                style={{ background: offer.color }}
              >
                <div className="offer-card-top">
                  <span className="offer-badge-pill">{offer.badge}</span>
                  <h3 className="offer-card-title">{offer.title}</h3>
                  <p className="offer-card-desc">{offer.desc}</p>
                </div>
                <div className="offer-card-footer">
                  <span className="promo-code-label">PROMO CODE</span>
                  <div className="promo-code-box">{offer.code}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advertisement / Membership Section */}
      <section className="landing-vip-section">
        <div className="vip-banner-gradient"></div>
        <div className="section-container">
          <div className="vip-banner-wrapper">
            <div className="vip-text-column animate-fade-in">
              <span className="vip-highlight-badge">CINEVERSE VIP</span>
              <h2 className="vip-banner-title">Upgrade to Premium Film Experience</h2>
              <p className="vip-banner-desc">
                Join our VIP Club today to unlock zero internet handling fees, free seat upgrades, unlimited cancellations up to 2 hours before the show, and pre-booking access to major global blockbusters.
              </p>
              <div className="vip-benefits-checklist">
                <div className="benefit-item">
                  <span className="check-icon">✓</span> Zero Booking Fees
                </div>
                <div className="benefit-item">
                  <span className="check-icon">✓</span> Free Seat Selection
                </div>
                <div className="benefit-item">
                  <span className="check-icon">✓</span> Priority Food Counters
                </div>
              </div>
              <button 
                className="vip-cta-btn" 
                onClick={() => navigate("/login")}
              >
                Join VIP Club Now
              </button>
            </div>
            <div className="vip-visual-column">
              <div className="vip-card-mockup">
                <div className="vip-card-glow"></div>
                <div className="vip-card-inner">
                  <div className="card-top-row">
                    <span className="card-brand">CineVerse</span>
                    <span className="card-chip"></span>
                  </div>
                  <div className="card-mid-row">
                    <div className="card-member-tier">VIP MEMBER</div>
                    <div className="card-member-id">★★★★ ★★★★ 8890</div>
                  </div>
                  <div className="card-bot-row">
                    <div className="card-holder-name">CHETAN TRIVEDI</div>
                    <div className="card-expiry">EXP 12/28</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Tech Features Section */}
      <section className="landing-features-section">
        <div className="section-container">
          <div className="section-header text-center">
            <span className="section-subtitle">Why CineVerse?</span>
            <h2 className="section-title">The CineVerse Advantage</h2>
            <p className="section-desc-para">We bring state-of-the-art cinematic technology and premium hospitality directly to your fingertips.</p>
          </div>

          <div className="features-cards-grid">
            {features.map((feature, i) => (
              <div key={i} className="advantage-feature-card">
                <div className="feature-card-icon-box">{feature.icon}</div>
                <h3 className="feature-card-title">{feature.title}</h3>
                <p className="feature-card-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="landing-footer-section">
        <div className="section-container">
          <div className="footer-top-grid">
            <div className="footer-brand-column">
              <h2 className="footer-logo">Cine<span className="logo-highlight">Verse</span></h2>
              <p className="footer-brand-desc">
                CineVerse is a premier microservices-driven film discovery and interactive booking application designed to deliver modern cinema experiences.
              </p>
            </div>
            <div className="footer-links-column">
              <h4>Browse</h4>
              <ul>
                <li><span onClick={() => navigate("/login")}>Movies</span></li>
                <li><span onClick={() => navigate("/login")}>Shows</span></li>
                <li><span onClick={() => navigate("/login")}>Theatres</span></li>
                <li><span onClick={() => navigate("/login")}>Events</span></li>
              </ul>
            </div>
            <div className="footer-links-column">
              <h4>Company</h4>
              <ul>
                <li><span>About Us</span></li>
                <li><span>VIP Club</span></li>
                <li><span>Press & Media</span></li>
                <li><span>Contact Help</span></li>
              </ul>
            </div>
            <div className="footer-links-column">
              <h4>Security & Policy</h4>
              <ul>
                <li><span>Terms of Use</span></li>
                <li><span>Privacy Policy</span></li>
                <li><span>Refund Rules</span></li>
                <li><span>FAQ Support</span></li>
              </ul>
            </div>
          </div>

          <div className="footer-divider-line"></div>

          <div className="footer-bottom-row">
            <p className="footer-copy-text">© 2026 CineVerse Entertainment Ltd. All rights reserved.</p>
            <p className="footer-buff-tag">Made with 🍿 for movie enthusiasts worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
