import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/authStore";
import {
  getTrendingMovies,
  getUserBookings,
  getMovies,
  addMovie,
  updateMovie,
  deleteMovie,
  deleteMovieShowsForCinema,
  addShow,
  deleteShow,
  getAllBookings,
  getAllUsers,
  updateUserRole,
  deleteUser,
  updateUserStatus
} from "../services/api";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const { role, user } = useAuth();

  // Active tabs for dashboards
  const [searchParams, setSearchParams] = useSearchParams();
  const activeUserTab = searchParams.get("tab") || "home";
  const setActiveUserTab = (tabName) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("tab", tabName);
    setSearchParams(newParams);
  };
  const [activeOwnerTab, setActiveOwnerTab] = useState("overview"); // overview, movies, shows, bookings
  const [activeAdminTab, setActiveAdminTab] = useState("overview"); // overview, users, approvals, reviews
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // General state
  const [movies, setMovies] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);

  // Local state for Watchlist & Reviews
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem("watchlist");
    return saved ? JSON.parse(saved) : [];
  });
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem("user_reviews");
    return saved ? JSON.parse(saved) : [
      { id: 1, movieTitle: "Interstellar", rating: 5, comment: "Masterpiece! The music by Hans Zimmer is out of this world.", author: "testuser@example.com", isSpam: false },
      { id: 2, movieTitle: "Joker", rating: 4, comment: "Amazing acting by Joaquin Phoenix, dark but brilliant.", author: "owner@example.com", isSpam: false },
      { id: 3, movieTitle: "Avatar", rating: 2, comment: "Spam comment buy cheap tickets at sketchy-url.com!!!", author: "spammer@spam.com", isSpam: true }
    ];
  });

  // Theatre Owner Form States
  const [newMovie, setNewMovie] = useState({ title: "", genre: "", duration: "", rating: 8.0, description: "", imageUrl: "" });
  const [editingMovie, setEditingMovie] = useState(null);
  const [newShow, setNewShow] = useState({ movieId: "", showTime: "06:30 PM", price: 250.0, city: "Chandigarh", cinema: "PVR Elante Mall, Chandigarh", dayOffset: 0 });
  const [ownerShows, setOwnerShows] = useState([]);
  const [cancelShowModal, setCancelShowModal] = useState(null); // { id, movieTitle, showTime, price, dayOffset, cinema }

  // Admin States
  const [allUsers, setAllUsers] = useState([]);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("ALL");
  const [confirmBanUserId, setConfirmBanUserId] = useState(null);
  const [systemLogs, setSystemLogs] = useState([
    { time: "11:58:39 AM", message: "Postgres connected successfully on port 5432." },
    { time: "11:59:12 AM", message: "movie-service started on port 8081." },
    { time: "11:59:52 AM", message: "CineVerse movies database successfully seeded." },
    { time: "12:01:05 PM", message: "User session initialized." }
  ]);
  const approvalsList = allUsers
    .filter(u => u.role?.toUpperCase() === "THEATRE_OWNER")
    .map(u => ({
      id: u.id,
      name: u.cinemaName || "N/A",
      city: u.city || "N/A",
      owner: u.email,
      status: u.status === "APPROVED" ? "Approved" : u.status === "PENDING" ? "Pending" : "Rejected"
    }));

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const refreshMovies = async () => {
    const latestMovies = await getMovies();
    setMovies(latestMovies);
    return latestMovies;
  };

  // Dynamic Owner Analytics
  const totalEarnings = role === "theatre_owner" ? bookings.reduce((sum, b) => sum + b.price, 0) : 0;
  
  // Average occupancy: calculate based on total owner shows and bookings
  const totalCapacity = ownerShows.length * 16;
  const avgOccupancyPercent = role === "theatre_owner" && totalCapacity > 0
    ? (bookings.length / totalCapacity) * 100
    : 0;
  const avgOccupancy = avgOccupancyPercent > 0 && avgOccupancyPercent < 1 
    ? avgOccupancyPercent.toFixed(2) 
    : Math.min(100, Math.round(avgOccupancyPercent));

  const activeScreens = role === "theatre_owner" ? new Set(ownerShows.map(s => s.movieTitle)).size : 0;

  // Real-Time Occupancy categories helper
  const getShowCategory = (timeStr) => {
    if (!timeStr) return "Evening";
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return "Evening";
    let hour = parseInt(match[1]);
    const ampm = match[3].toUpperCase();
    if (ampm === "PM" && hour < 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;
    
    if (hour >= 6 && hour < 14) return "Morning";
    if (hour >= 14 && hour < 18) return "Afternoon";
    if (hour >= 18 && hour < 22) return "Evening";
    return "Late Night";
  };

  const getOccupancyForCategory = (categoryName) => {
    const showsInCat = ownerShows.filter(s => getShowCategory(s.showTime) === categoryName);
    if (showsInCat.length === 0) return 0;
    
    const bookingsInCat = bookings.filter(b => getShowCategory(b.showTime) === categoryName);
    
    const catCapacity = showsInCat.length * 16;
    const percent = (bookingsInCat.length / catCapacity) * 100;
    return percent > 0 && percent < 1 ? percent.toFixed(2) : Math.min(100, Math.round(percent));
  };

  // Popular movies from bookings
  const movieBookingCounts = {};
  if (role === "theatre_owner") {
    bookings.forEach(b => {
      movieBookingCounts[b.movieTitle] = (movieBookingCounts[b.movieTitle] || 0) + 1;
    });
  }
  const popularMoviesList = Object.entries(movieBookingCounts)
    .map(([title, count]) => {
      const movieObj = movies.find(m => m.title === title);
      return {
        title,
        count,
        rating: movieObj ? movieObj.rating : 8.0
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  // Pre-fill and lock scheduler form for theatre owner
  useEffect(() => {
    if (role === "theatre_owner" && user) {
      setNewShow(prev => ({
        ...prev,
        city: user.city || "",
        cinema: user.cinemaName || ""
      }));
    }
  }, [role, user]);

  // Load appropriate data based on role with 5-second polling for real-time dashboard updates
  useEffect(() => {
    getTrendingMovies().then(setTrendingMovies);
    refreshMovies().catch(err => console.log(err));

    const loadData = () => {
      if (role === "user") {
        getUserBookings().then((data) => {
          setBookings((prev) => {
            if (JSON.stringify(prev) !== JSON.stringify(data)) {
              window.dispatchEvent(new CustomEvent("bookingsUpdated", { detail: data.length }));
              return data;
            }
            return prev;
          });
        }).catch(err => console.log(err));
      } else if (role === "theatre_owner") {
        if (user) {
          const ownerCinema = user.cinemaName?.trim().toLowerCase();
          const ownerCity = user.city?.trim().toLowerCase();
          getAllBookings().then((data) => {
            const filteredBookings = data.filter(b => {
              const bookingCinema = b.cinema?.trim().toLowerCase();
              const bookingCity = b.city?.trim().toLowerCase();
              return bookingCinema === ownerCinema && bookingCity === ownerCity;
            });
            setBookings((prev) => {
              if (JSON.stringify(prev) !== JSON.stringify(filteredBookings)) {
                return filteredBookings;
              }
              return prev;
            });
          }).catch(err => console.log(err));
        }
      } else if (role === "admin") {
        getAllBookings().then((data) => {
          setBookings((prev) => {
            if (JSON.stringify(prev) !== JSON.stringify(data)) {
              return data;
            }
            return prev;
          });
        }).catch(err => console.log(err));
        getAllUsers().then(setAllUsers).catch(err => console.log(err));
      }
    };

    loadData();
    if (role === "theatre_owner" && user) {
      refreshOwnerShows();
    }

    const intervalId = setInterval(loadData, 5000);

    return () => clearInterval(intervalId);
  }, [role, user]);

  useEffect(() => {
    if (role === "theatre_owner" && (activeOwnerTab === "movies" || activeOwnerTab === "shows")) {
      refreshMovies().catch(err => console.log(err));
    }
  }, [role, activeOwnerTab]);

  const refreshOwnerShows = () => {
    if (!user) return;
    // Collect all shows for all movies concurrently to prevent blocking lag
    getMovies().then(async (allMovies) => {
      try {
        const promises = allMovies.map(async (m) => {
          try {
            const res = await fetch(`/api/movies/${m.id}/shows`);
            if (res.ok) {
              const data = await res.json();
              return data.map(s => ({ ...s, movieTitle: m.title, movieId: m.id }));
            }
          } catch (err) {
            console.error(`Error loading shows for movie ${m.title}:`, err);
          }
          return [];
        });
        const results = await Promise.all(promises);
        const allShows = results.flat();
        
        const ownerCinema = user.cinemaName?.trim().toLowerCase();
        const ownerCity = user.city?.trim().toLowerCase();
        
        const filteredShows = allShows.filter(s => {
          const showCinema = s.cinema?.trim().toLowerCase();
          const showCity = s.city?.trim().toLowerCase();
          return showCinema === ownerCinema && showCity === ownerCity;
        });
        setOwnerShows(filteredShows);
      } catch (e) {
        console.error("Failed to load owner shows:", e);
      }
    });
  };

  const logEvent = (msg) => {
    const time = new Date().toLocaleTimeString();
    setSystemLogs(prev => [{ time, message: msg }, ...prev]);
  };

  // --- Watchlist Handlers ---
  const toggleWatchlist = (movie) => {
    let updated;
    if (watchlist.some(m => m.id === movie.id)) {
      updated = watchlist.filter(m => m.id !== movie.id);
      logEvent(`Removed "${movie.title}" from watchlist.`);
    } else {
      updated = [...watchlist, movie];
      logEvent(`Added "${movie.title}" to watchlist.`);
    }
    setWatchlist(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
    window.dispatchEvent(new Event("watchlistUpdated"));
  };

  // --- Reviews Handlers ---
  const handleAddReview = (e, movieTitle, rating, comment) => {
    e.preventDefault();
    const newRev = {
      id: Date.now(),
      movieTitle,
      rating: Number(rating),
      comment,
      author: user?.email || "anonymous@cineverse.com",
      isSpam: false
    };
    const updated = [newRev, ...reviews];
    setReviews(updated);
    localStorage.setItem("user_reviews", JSON.stringify(updated));
    logEvent(`User added review for movie "${movieTitle}".`);
  };

  // --- Theatre Owner Handlers ---
  const handleAddMovieSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    try {
      if (editingMovie) {
        const saved = await updateMovie(editingMovie.id, newMovie);
        const latestMovies = await refreshMovies();
        if (newShow.movieId === editingMovie.id) {
          const updatedMovie = latestMovies.find(m => m.id === saved.id);
          if (updatedMovie) {
            setNewShow(prev => ({ ...prev, movieId: updatedMovie.id }));
          }
        }
        setFormSuccess(`Movie "${saved.title}" updated successfully!`);
        setEditingMovie(null);
      } else {
        const saved = await addMovie(newMovie);
        const latestMovies = await refreshMovies();
        const savedMovie = latestMovies.find(m => m.id === saved.id) || saved;
        setNewShow(prev => ({ ...prev, movieId: savedMovie.id || "" }));
        setActiveOwnerTab("shows");
        setFormSuccess(`Movie "${saved.title}" added successfully! Add showtimes for it now.`);
      }
      setNewMovie({ title: "", genre: "", duration: "", rating: 8.0, description: "", imageUrl: "" });
      logEvent(editingMovie ? `Theatre Owner updated movie: "${newMovie.title}".` : `Theatre Owner added movie: "${newMovie.title}".`);
    } catch (err) {
      setFormError(editingMovie ? "Failed to update movie." : "Failed to add movie.");
    }
  };

  const handleDeleteMovie = async (id, title) => {
    if (role === "theatre_owner" && user) {
      // Owner: only remove shows for their cinema, not the movie itself
      if (!window.confirm(`Remove all showtimes for "${title}" from your cinema?`)) return;
      try {
        await deleteMovieShowsForCinema(id, user.cinemaName, user.city);
        const updatedMovies = await getMovies();
        setMovies(updatedMovies);
        logEvent(`Removed all shows for "${title}" from ${user.cinemaName}.`);
        refreshOwnerShows();
      } catch (err) {
        alert("Failed to remove shows.");
      }
    } else {
      // Admin: full platform delete
      if (!window.confirm(`Are you sure you want to delete "${title}" from the entire platform?`)) return;
      try {
        await deleteMovie(id);
        setMovies(movies.filter(m => m.id !== id));
        logEvent(`Movie "${title}" and all its shows deleted from platform.`);
        refreshOwnerShows();
      } catch (err) {
        alert("Failed to delete movie.");
      }
    }
  };

  const handleAddShowSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    if (!newShow.movieId) {
      setFormError("Please select a movie.");
      return;
    }
    try {
      const showData = {
        movie: { id: String(newShow.movieId) },
        showTime: newShow.showTime,
        price: Number(newShow.price),
        city: newShow.city,
        cinema: newShow.cinema,
        dayOffset: Number(newShow.dayOffset)
      };
      await addShow(showData);
      setFormSuccess("Showtime added successfully!");
      refreshOwnerShows();
      logEvent(`Added showtime ${newShow.showTime} at ${newShow.cinema}.`);
    } catch (err) {
      setFormError("Failed to add show.");
    }
  };

  const handleDeleteShow = async () => {
    if (!cancelShowModal) return;
    const { id, showTime, cinema, movieTitle } = cancelShowModal;
    try {
      await deleteShow(id);
      setOwnerShows(ownerShows.filter(s => s.id !== id));
      logEvent(`Cancelled show "${movieTitle}" at ${showTime} (${cinema}).`);
      setCancelShowModal(null);
    } catch (err) {
      alert("Failed to cancel show.");
    }
  };

  // --- Admin Handlers ---
  const handleUserRoleChange = async (userId, userEmail, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      setAllUsers(allUsers.map(u => u.id === userId ? { ...u, role: newRole } : u));
      logEvent(`Admin changed role of ${userEmail} to "${newRole}".`);
    } catch (err) {
      alert("Failed to update user role.");
    }
  };

  const handleBanUser = async (userId, userEmail) => {
    try {
      await deleteUser(userId);
      setAllUsers(allUsers.filter(u => u.id !== userId));
      logEvent(`Admin banned and deleted user: ${userEmail}.`);
    } catch (err) {
      alert("Failed to delete user.");
    }
  };

  const handleApproveTheatre = async (id, name) => {
    try {
      await updateUserStatus(id, "APPROVED");
      setAllUsers(allUsers.map(u => u.id === id ? { ...u, status: "APPROVED" } : u));
      logEvent(`Admin approved theatre request: "${name}".`);
    } catch (err) {
      alert("Failed to approve theatre.");
    }
  };

  const handleRejectTheatre = async (id, name) => {
    try {
      await updateUserStatus(id, "REJECTED");
      setAllUsers(allUsers.map(u => u.id === id ? { ...u, status: "REJECTED" } : u));
      logEvent(`Admin rejected theatre request: "${name}".`);
    } catch (err) {
      alert("Failed to reject theatre.");
    }
  };

  const handleRemoveReview = (id, movieTitle) => {
    const updated = reviews.filter(r => r.id !== id);
    setReviews(updated);
    localStorage.setItem("user_reviews", JSON.stringify(updated));
    logEvent(`Admin deleted spam review for movie "${movieTitle}".`);
  };

  const filteredUsers = allUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(userSearchQuery.toLowerCase());
    const matchesRole = userRoleFilter === "ALL" || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const defaultSpotlight = {
    id: "",
    title: "Oppenheimer",
    genre: "Drama, Historical, Period",
    rating: 8.4,
    duration: "180 Min",
    description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb, which changed the course of history.",
    imageUrl: "https://image.tmdb.org/t/p/w1280/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg"
  };

  const spotlightMovie = movies.find(m => m.title === "Oppenheimer") || movies.find(m => m.title === "Dune: Part Two") || movies[0] || defaultSpotlight;

  return (
    <div className="dashboard-page">
      <Navbar />

      {/* ================= USER PANEL ================= */}
      {role === "user" && (
        <div className="user-dashboard-wrapper">
          <div className={`user-sidebar-nav ${isSidebarCollapsed ? "collapsed" : ""}`}>
            {/* Collapse toggle button */}
            <button 
              className="sidebar-toggle-btn" 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isSidebarCollapsed ? "→" : "←"}
            </button>

            <div className="sidebar-brand">
              {!isSidebarCollapsed ? (
                <>
                  <span>User Menu</span>
                  <span className="live-dot" title="User Session Active"></span>
                </>
              ) : (
                <span className="live-dot" style={{ margin: 0 }} title="User Session Active"></span>
              )}
            </div>

            <button 
              className={`sidebar-btn ${activeUserTab === "home" ? "active" : ""}`}
              onClick={() => setActiveUserTab("home")}
              title="Spotlight"
            >
              <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              {!isSidebarCollapsed && <span className="sidebar-label">Spotlight</span>}
            </button>

            <button 
              className={`sidebar-btn ${activeUserTab === "bookings" ? "active" : ""}`}
              onClick={() => setActiveUserTab("bookings")}
              title="My Bookings"
            >
              <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M12 4v16" strokeDasharray="3 3" />
                <path d="M3 9h3a2 2 0 0 1 0 4H3" />
                <path d="M21 9h-3a2 2 0 0 0 0 4h3" />
              </svg>
              {!isSidebarCollapsed && (
                <>
                  <span className="sidebar-label">My Bookings</span>
                  <span className="sidebar-badge">{bookings.length}</span>
                </>
              )}
              {isSidebarCollapsed && bookings.length > 0 && (
                <span className="sidebar-badge collapsed">{bookings.length}</span>
              )}
            </button>

            <button 
              className={`sidebar-btn ${activeUserTab === "watchlist" ? "active" : ""}`}
              onClick={() => setActiveUserTab("watchlist")}
              title="Watchlist"
            >
              <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              {!isSidebarCollapsed && (
                <>
                  <span className="sidebar-label">Watchlist</span>
                  <span className="sidebar-badge">{watchlist.length}</span>
                </>
              )}
              {isSidebarCollapsed && watchlist.length > 0 && (
                <span className="sidebar-badge collapsed">{watchlist.length}</span>
              )}
            </button>

            <button 
              className={`sidebar-btn ${activeUserTab === "reviews" ? "active" : ""}`}
              onClick={() => setActiveUserTab("reviews")}
              title="Movie Reviews"
            >
              <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {!isSidebarCollapsed && <span className="sidebar-label">Movie Reviews</span>}
            </button>
          </div>

          <div className="user-main-content">
            {activeUserTab === "home" && (
              <>
                {/* Cinematic Spotlight Banner */}
                <div className="hero-section" style={{ backgroundImage: `url(${spotlightMovie.imageUrl})` }}>
                  <div className="hero-banner-overlay"></div>
                  <div className="hero-content">
                    <span className="hero-badge">SPOTLIGHT OF THE MONTH</span>
                    <h1 className="hero-title">{spotlightMovie.title}</h1>
                    <div className="hero-meta-tags">
                      {spotlightMovie.genre.split(",").map((g, idx) => (
                        <span key={idx} className="meta-tag">{g.trim()}</span>
                      ))}
                      <span className="meta-tag rating">★ {spotlightMovie.rating ? spotlightMovie.rating.toFixed(1) : "N/A"} Rating</span>
                      {spotlightMovie.duration && <span className="meta-tag">{spotlightMovie.duration}</span>}
                    </div>
                    <p className="hero-desc">
                      {spotlightMovie.description}
                    </p>
                    <div className="hero-buttons">
                      <button className="btn-hero-primary" onClick={() => navigate("/booking", { state: { movieId: spotlightMovie.id } })}>
                        Book Tickets Now
                      </button>
                      <button className="btn-hero-secondary" onClick={() => navigate("/movies")}>
                        Explore All Movies
                      </button>
                    </div>
                  </div>
                </div>

                <div className="dashboard-container-layout">
                  {/* Trending Section */}
                  <section className="trending-section">
                    <div className="section-header">
                      <h2>Now Showing & Trending</h2>
                      <p className="section-subtitle">Top rated movies in theatres today</p>
                    </div>
                    <div className="movies-grid">
                      {trendingMovies.map((movie) => (
                        <div key={movie.id} className="movie-card-container">
                          <MovieCard movie={movie} />
                          <button 
                            className={`watchlist-btn-overlay ${watchlist.some(m => m.id === movie.id) ? "in-list" : ""}`}
                            onClick={() => toggleWatchlist(movie)}
                            title={watchlist.some(m => m.id === movie.id) ? "Remove from watchlist" : "Add to watchlist"}
                          >
                            {watchlist.some(m => m.id === movie.id) ? "★" : "☆"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </>
            )}

            {activeUserTab === "bookings" && (
              <div className="dashboard-container-layout">
                <section className="bookings-section">
                  <div className="section-header">
                    <h2>Your Ticket Bookings</h2>
                    <p className="section-subtitle">Real-time status of your reserved cinema seats</p>
                  </div>

                  {bookings.length === 0 ? (
                    <div className="empty-bookings-card">
                      <div className="empty-bookings-icon">★</div>
                      <p>You don't have any bookings yet.</p>
                      <button className="empty-btn" onClick={() => navigate("/booking")}>
                        Reserve a Seat Now
                      </button>
                    </div>
                  ) : (
                    <div className="user-tickets-grid">
                      {(() => {
                        const groupBookings = (list) => {
                          const groups = [];
                          list.forEach((b) => {
                            const match = groups.find((g) => {
                              const timeDiff = Math.abs(new Date(g.bookedAt).getTime() - new Date(b.bookedAt).getTime());
                              return g.movieTitle === b.movieTitle &&
                                     g.showTime === b.showTime &&
                                     g.cinema === b.cinema &&
                                     g.city === b.city &&
                                     timeDiff < 15000;
                            });
                            if (match) {
                              match.seats.push(b.seatNumber);
                              match.ids.push(b.id);
                              match.totalPrice += b.price;
                            } else {
                              groups.push({
                                ...b,
                                seats: [b.seatNumber],
                                ids: [b.id],
                                totalPrice: b.price
                              });
                            }
                          });
                          return groups;
                        };

                        return groupBookings(bookings).map((booking) => {
                          const movieObj = movies.find(m => m.title === booking.movieTitle);
                          const sortedSeats = [...booking.seats].sort((x, y) => 
                            x.localeCompare(y, undefined, { numeric: true, sensitivity: "base" })
                          );
                          const seatCategory = booking.seats[0].startsWith("A") ? "EXECUTIVE" : booking.seats[0].startsWith("B") ? "PREMIUM" : "CLASSIC";
                          
                          return (
                            <div key={booking.ids[0]} className="custom-ticket-card">
                              {/* Top Section */}
                              <div className="ticket-top-section">
                                <div className="ticket-poster-wrapper">
                                  <img 
                                    src={movieObj?.imageUrl || "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070"} 
                                    alt={booking.movieTitle} 
                                    className="ticket-poster" 
                                  />
                                </div>
                                <div className="ticket-movie-details">
                                  <h3 className="ticket-movie-title">{booking.movieTitle}</h3>
                                  <p className="ticket-movie-genre">{movieObj?.genre || "Action, Sci-Fi"}</p>
                                   <p className="ticket-show-datetime">
                                     {(() => {
                                       // Calculate actual show date: bookedAt date + dayOffset
                                       const showDate = new Date(booking.bookedAt);
                                       if (booking.dayOffset != null) {
                                         showDate.setDate(showDate.getDate() + booking.dayOffset);
                                       }
                                       return showDate.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
                                     })()} | {booking.showTime}
                                   </p>
                                  <p className="ticket-cinema-name">{booking.cinema || "Multiplex Cinema"}</p>
                                </div>
                                <div className="ticket-m-label">
                                  <span>M-Ticket</span>
                                </div>
                              </div>

                              {/* Middle Bar */}
                              <div className="ticket-middle-bar">
                                <span>Tap for support, details & more actions</span>
                              </div>

                              {/* Bottom Section */}
                              <div className="ticket-bottom-section">
                                <div className="ticket-bottom-left">
                                  <div className="ticket-brand-logo">CineVerse</div>
                                </div>
                                <div className="ticket-bottom-right">
                                  <div className="ticket-info-item">
                                    <span className="ticket-info-label">{booking.seats.length} Ticket(s)</span>
                                  </div>
                                  <div className="ticket-info-item">
                                    <span className="ticket-info-val-large">AUDI 2</span>
                                  </div>
                                  <div className="ticket-info-item">
                                    <span className="ticket-info-seat">
                                      {seatCategory} - {sortedSeats.join(", ")}
                                    </span>
                                  </div>
                                  <div className="ticket-info-item booking-id-row">
                                    <span>BOOKING ID: <strong>{booking.ids[0].substring(0, 8).toUpperCase()}</strong></span>
                                  </div>
                                </div>
                              </div>

                              {/* Footer Bar */}
                              <div className="ticket-footer-bar">
                                <span>Cancellation policy applies to this venue</span>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  )}
                </section>
              </div>
            )}

            {activeUserTab === "watchlist" && (
              <div className="dashboard-container-layout">
                <section className="trending-section">
                  <div className="section-header">
                    <h2>My Watchlist</h2>
                    <p className="section-subtitle">Movies you plan to watch soon</p>
                  </div>

                  {watchlist.length === 0 ? (
                    <div className="empty-bookings-card">
                      <div className="empty-bookings-icon">★</div>
                      <p>Your watchlist is empty.</p>
                      <button className="empty-btn" onClick={() => navigate("/movies")}>
                        Browse Movies
                      </button>
                    </div>
                  ) : (
                    <div className="movies-grid">
                      {watchlist.map((movie) => (
                        <div key={movie.id} className="movie-card-container">
                          <MovieCard movie={movie} />
                          <button 
                            className="watchlist-btn-overlay in-list"
                            onClick={() => toggleWatchlist(movie)}
                            title="Remove from watchlist"
                          >
                            ★
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}

            {activeUserTab === "reviews" && (
              <div className="dashboard-container-layout">
                <section className="reviews-section-panel">
                  <div className="section-header">
                    <h2>Movie Reviews & Ratings</h2>
                    <p className="section-subtitle">Share your cinematic experiences with others</p>
                  </div>

                  <div className="reviews-dual-layout">
                    {/* Left Column: Write Review */}
                    <div className="write-review-card">
                      <h3>Write a Review</h3>
                      <form onSubmit={(e) => {
                        const fd = new FormData(e.currentTarget);
                        handleAddReview(e, fd.get("movieTitle"), fd.get("rating"), fd.get("comment"));
                        e.currentTarget.reset();
                      }}>
                        <div className="form-group">
                          <label>Select Movie</label>
                          <select name="movieTitle" required className="form-select-control">
                            {movies.map(m => <option key={m.id} value={m.title}>{m.title}</option>)}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Rating (Out of 5)</label>
                          <select name="rating" required className="form-select-control">
                            <option value="5">★★★★★ (Excellent)</option>
                            <option value="4">★★★★ (Great)</option>
                            <option value="3">★★★ (Average)</option>
                            <option value="2">★★ (Poor)</option>
                            <option value="1">★ (Terrible)</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Comments</label>
                          <textarea name="comment" rows="4" placeholder="What did you think of the cinematography, story, music?" required className="form-textarea-control"></textarea>
                        </div>
                        <button type="submit" className="btn-submit-review">Publish Review</button>
                      </form>
                    </div>

                    {/* Right Column: Public Reviews list */}
                    <div className="public-reviews-card">
                      <h3>Recent User Reviews</h3>
                      <div className="reviews-feed-container">
                        {reviews.filter(r => !r.isSpam).map(rev => (
                          <div key={rev.id} className="review-feed-item">
                            <div className="review-feed-header">
                              <span className="review-author">{rev.author}</span>
                              <span className="review-rating">{"★".repeat(rev.rating)}</span>
                            </div>
                            <h4 className="review-movie-target">on {rev.movieTitle}</h4>
                            <p className="review-comment">"{rev.comment}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      )}


      {/* ================= THEATRE OWNER PANEL ================= */}
      {role === "theatre_owner" && (
        <div className="owner-dashboard-wrapper">
          <div className="owner-sidebar-nav">
            <div className="sidebar-brand">
              <span>Owner Console</span>
              <span className="live-dot" title="Console Active"></span>
            </div>
            <button className={`sidebar-btn ${activeOwnerTab === "overview" ? "active" : ""}`} onClick={() => setActiveOwnerTab("overview")}>
              <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              Overview Dashboard
            </button>
            <button className={`sidebar-btn ${activeOwnerTab === "movies" ? "active" : ""}`} onClick={() => setActiveOwnerTab("movies")}>
              <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                <line x1="7" y1="2" x2="7" y2="22" />
                <line x1="17" y1="2" x2="17" y2="22" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <line x1="2" y1="7" x2="7" y2="7" />
                <line x1="2" y1="17" x2="7" y2="17" />
                <line x1="17" y1="17" x2="22" y2="17" />
                <line x1="17" y1="7" x2="22" y2="7" />
              </svg>
              Manage Movies ({movies.length})
            </button>
            <button className={`sidebar-btn ${activeOwnerTab === "shows" ? "active" : ""}`} onClick={() => setActiveOwnerTab("shows")}>
              <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Manage Shows ({ownerShows.length})
            </button>
            <button className={`sidebar-btn ${activeOwnerTab === "bookings" ? "active" : ""}`} onClick={() => setActiveOwnerTab("bookings")}>
              <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              Booking Analytics
            </button>
          </div>

          <div className="owner-main-content">
            <header className="owner-content-header">
              <h1>Welcome, Cinema Manager</h1>
              <p>Manage showtimes, theatres, and pricing factors dynamically</p>
            </header>

            {/* ERROR & SUCCESS alerts */}
            {formError && <div className="owner-alert alert-error">{formError}</div>}
            {formSuccess && <div className="owner-alert alert-success">{formSuccess}</div>}

            {activeOwnerTab === "overview" && (
              <div className="owner-panel-section animate-fade-in">
                {/* Stats Cards */}
                <div className="owner-stats-grid">
                  <div className="stats-subgrid">
                    <div className="stat-card-item purple">
                      <div className="stat-card-header">
                        <div className="stat-icon-wrapper">
                          <svg className="stat-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                        </div>
                      </div>
                      <div className="stat-info">
                        <span className="stat-num">{ownerShows.length}</span>
                        <span className="stat-label">Total Shows Scheduled</span>
                      </div>
                    </div>
                    <div className="stat-card-item green">
                      <div className="stat-card-header">
                        <div className="stat-icon-wrapper">
                          <svg className="stat-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="1" x2="12" y2="23"></line>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                          </svg>
                        </div>
                      </div>
                      <div className="stat-info">
                        <span className="stat-num">₹{totalEarnings.toLocaleString()}</span>
                        <span className="stat-label">Total Earnings</span>
                      </div>
                    </div>
                  </div>

                  <div className="stats-subgrid">
                    <div className="stat-card-item orange">
                      <div className="stat-card-header">
                        <div className="stat-icon-wrapper">
                          <svg className="stat-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                            <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                          </svg>
                        </div>
                      </div>
                      <div className="stat-info">
                        <span className="stat-num">{avgOccupancy}%</span>
                        <span className="stat-label">Avg. Occupancy Rate</span>
                      </div>
                    </div>
                    <div className="stat-card-item blue">
                      <div className="stat-card-header">
                        <div className="stat-icon-wrapper">
                          <svg className="stat-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                            <line x1="8" y1="21" x2="16" y2="21"></line>
                            <line x1="12" y1="17" x2="12" y2="21"></line>
                          </svg>
                        </div>
                      </div>
                      <div className="stat-info">
                        <span className="stat-num">{activeScreens} Screen{activeScreens !== 1 ? "s" : ""}</span>
                        <span className="stat-label">Active Audiences</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grid layout for analytics */}
                <div className="owner-dual-grid">
                  <div className="owner-analytics-card">
                    <h3>Real-Time Occupancy & Peak Booking Hours</h3>
                    <div className="progress-list-metrics">
                      <div className="metric-progress-item">
                        <div className="metric-label-row">
                          <span>Morning Shows (10 AM - 1 PM)</span>
                          <strong>{getOccupancyForCategory("Morning")}% Occupied</strong>
                        </div>
                        <div className="progress-bar-container"><div className="bar-fill" style={{ width: `${getOccupancyForCategory("Morning")}%` }}></div></div>
                      </div>
                      <div className="metric-progress-item">
                        <div className="metric-label-row">
                          <span>Afternoon Shows (2 PM - 5 PM)</span>
                          <strong>{getOccupancyForCategory("Afternoon")}% Occupied</strong>
                        </div>
                        <div className="progress-bar-container"><div className="bar-fill" style={{ width: `${getOccupancyForCategory("Afternoon")}%` }}></div></div>
                      </div>
                      <div className="metric-progress-item">
                        <div className="metric-label-row">
                          <span>Evening Shows (6 PM - 9 PM)</span>
                          <strong>{getOccupancyForCategory("Evening")}% Occupied</strong>
                        </div>
                        <div className="progress-bar-container"><div className="bar-fill" style={{ width: `${getOccupancyForCategory("Evening")}%`, backgroundColor: "#e50914" }}></div></div>
                      </div>
                      <div className="metric-progress-item">
                        <div className="metric-label-row">
                          <span>Late Night Shows (10 PM - 1 AM)</span>
                          <strong>{getOccupancyForCategory("Late Night")}% Occupied</strong>
                        </div>
                        <div className="progress-bar-container"><div className="bar-fill" style={{ width: `${getOccupancyForCategory("Late Night")}%` }}></div></div>
                      </div>
                    </div>
                  </div>

                  <div className="owner-analytics-card">
                    <h3>Popular Movies Chart</h3>
                    <div className="popular-movies-list">
                      {popularMoviesList.length === 0 ? (
                        <p style={{ color: "var(--text-muted)", padding: "10px" }}>No bookings recorded yet.</p>
                      ) : (
                        popularMoviesList.map((pm, idx) => (
                          <div key={pm.title} className="pop-movie-row">
                            <span className={`pop-rank rank-${idx + 1}`}>{idx + 1}</span>
                            <span className="pop-title">{pm.title}</span>
                            <span className="pop-score">★ {pm.rating} Rating ({pm.count} booking{pm.count !== 1 ? 's' : ''})</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeOwnerTab === "movies" && (
              <div className="owner-panel-section animate-fade-in">
                <div className="owner-dual-grid">
                  
                  {/* Left: Add Movie Form */}
                  <div className="owner-card-form">
                    <h3>{editingMovie ? "Edit Movie Details" : "Add New Movie to Platform Catalog"}</h3>
                    <form onSubmit={handleAddMovieSubmit} className="owner-crud-form">
                      <div className="form-row-group">
                        <div className="form-input-box">
                          <label>Movie Title</label>
                          <input type="text" placeholder="e.g. Gladiator II" value={newMovie.title} onChange={e => setNewMovie({ ...newMovie, title: e.target.value })} required />
                        </div>
                        <div className="form-input-box">
                          <label>Genre</label>
                          <input type="text" placeholder="e.g. Action, Drama" value={newMovie.genre} onChange={e => setNewMovie({ ...newMovie, genre: e.target.value })} required />
                        </div>
                      </div>
                      <div className="form-row-group">
                        <div className="form-input-box">
                          <label>Duration</label>
                          <input type="text" placeholder="e.g. 2h 28m" value={newMovie.duration} onChange={e => setNewMovie({ ...newMovie, duration: e.target.value })} required />
                        </div>
                        <div className="form-input-box">
                          <label>Initial Rating</label>
                          <input type="number" step="0.1" max="10" min="1" placeholder="e.g. 8.4" value={newMovie.rating} onChange={e => setNewMovie({ ...newMovie, rating: Number(e.target.value) })} required />
                        </div>
                      </div>
                      <div className="form-input-box">
                        <label>Description / Synopsis</label>
                        <textarea rows="3" placeholder="Enter movie plot overview details..." value={newMovie.description} onChange={e => setNewMovie({ ...newMovie, description: e.target.value })} required></textarea>
                      </div>
                      <div className="form-input-box">
                        <label>Cover Poster Image URL</label>
                        <input type="url" placeholder="https://images.unsplash.com/..." value={newMovie.imageUrl} onChange={e => setNewMovie({ ...newMovie, imageUrl: e.target.value })} required />
                      </div>
                      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <button type="submit" className="owner-btn-submit" style={{ flex: 1, marginTop: 0 }}>
                          {editingMovie ? "Update Movie" : "Register Movie"}
                        </button>
                        {editingMovie && (
                          <button
                            type="button"
                            className="owner-btn-cancel"
                            onClick={() => {
                              setEditingMovie(null);
                              setNewMovie({ title: "", genre: "", duration: "", rating: 8.0, description: "", imageUrl: "" });
                            }}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* Right: Movies list */}
                  <div className="owner-list-wrapper">
                    <div className="owner-list-header">
                      <div>
                        <h3>Active Movies Catalog</h3>
                        <p>Movies are loaded from the movie-service MongoDB catalog.</p>
                      </div>
                      <span>{movies.length} movies</span>
                    </div>
                    <div className="owner-scroller-list">
                      {movies.map(m => {
                        const showCount = ownerShows.filter(s => s.movieId === m.id).length;
                        return (
                          <div key={m.id} className="owner-list-item">
                            <img
                              src={m.imageUrl || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600"}
                              alt={m.title}
                              className="owner-item-thumbnail"
                            />
                            <div className="owner-item-info">
                              <h4>{m.title}</h4>
                              <p>{m.genre} | {m.duration}</p>
                              <div className="owner-item-meta-row">
                                <span className="owner-rating-chip">Rating {m.rating}</span>
                                <span className={`owner-show-count ${showCount > 0 ? "has-shows" : ""}`}>
                                  {showCount} show{showCount !== 1 ? "s" : ""} at your cinema
                                </span>
                              </div>
                            </div>
                            <div className="owner-item-actions">
                              <button
                                type="button"
                                className="owner-btn-edit"
                                onClick={() => {
                                  setEditingMovie(m);
                                  setNewMovie({
                                    title: m.title || "",
                                    genre: m.genre || "",
                                    duration: m.duration || "",
                                    rating: m.rating || 8.0,
                                    description: m.description || "",
                                    imageUrl: m.imageUrl || ""
                                  });
                                }}
                              >
                                Edit
                              </button>
                              <button className="owner-btn-delete" onClick={() => handleDeleteMovie(m.id, m.title)}>
                                Remove from Cinema
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {activeOwnerTab === "shows" && (
              <div className="owner-panel-section animate-fade-in">
                <div className="owner-dual-grid">
                  
                  {/* Left: Add Show Form */}
                  <div className="owner-card-form">
                    <h3>Schedule a Showtime Slot</h3>
                    <form onSubmit={handleAddShowSubmit} className="owner-crud-form">
                      <div className="form-input-box">
                        <label>Select Movie</label>
                        <select value={newShow.movieId} onChange={e => setNewShow({ ...newShow, movieId: e.target.value })} required>
                          <option value="">-- Choose Movie --</option>
                          {movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                        </select>
                      </div>
                      <div className="form-row-group">
                        <div className="form-input-box">
                          <label>Showtime Clock</label>
                          <input type="text" placeholder="e.g. 06:30 PM" value={newShow.showTime} onChange={e => setNewShow({ ...newShow, showTime: e.target.value })} required />
                        </div>
                        <div className="form-input-box">
                          <label>Ticket Price (Base)</label>
                          <input type="number" placeholder="250" value={newShow.price} onChange={e => setNewShow({ ...newShow, price: Number(e.target.value) })} required />
                        </div>
                      </div>
                      <div className="form-row-group">
                        <div className="form-input-box">
                          <label>City Location</label>
                          <input type="text" value={newShow.city} disabled />
                        </div>
                        <div className="form-input-box">
                          <label>Day Offset (0=Today, 1=Tomorrow...)</label>
                          <input type="number" min="0" max="6" value={newShow.dayOffset} onChange={e => setNewShow({ ...newShow, dayOffset: Number(e.target.value) })} required />
                        </div>
                      </div>
                      <div className="form-input-box">
                        <label>Cinema Hall / Auditorium</label>
                        <input type="text" value={newShow.cinema} disabled />
                      </div>
                      <button type="submit" className="owner-btn-submit">Publish Showtime</button>
                    </form>
                  </div>

                  {/* Right: Grouped Shows list */}
                  <div className="owner-list-wrapper">
                    <h3>Scheduled Showtimes</h3>
                    <div className="owner-scroller-list grouped-shows-list">
                      {ownerShows.length === 0 ? (
                        <p style={{ color: "var(--text-muted)", padding: "20px" }}>No shows scheduled yet.</p>
                      ) : (
                        (() => {
                          // Group shows by movieTitle
                          const grouped = {};
                          ownerShows.forEach(s => {
                            if (!grouped[s.movieTitle]) {
                              grouped[s.movieTitle] = { movieTitle: s.movieTitle, movieId: s.movieId, shows: [] };
                            }
                            grouped[s.movieTitle].shows.push(s);
                          });
                          // Sort shows within each group by dayOffset then showTime
                          Object.values(grouped).forEach(g => {
                            g.shows.sort((a, b) => a.dayOffset - b.dayOffset || a.showTime.localeCompare(b.showTime));
                          });
                          return Object.values(grouped).map(group => {
                            const movieObj = movies.find(m => m.title === group.movieTitle);
                            // Group by dayOffset for sub-sections
                            const dayGroups = {};
                            group.shows.forEach(s => {
                              const dayLabel = s.dayOffset === 0 ? "Today" : s.dayOffset === 1 ? "Tomorrow" : `Day +${s.dayOffset}`;
                              if (!dayGroups[dayLabel]) dayGroups[dayLabel] = [];
                              dayGroups[dayLabel].push(s);
                            });
                            return (
                              <div key={group.movieTitle} className="grouped-show-card">
                                <div className="grouped-show-header">
                                  {movieObj && <img src={movieObj.imageUrl} alt={group.movieTitle} className="grouped-show-poster" />}
                                  <div className="grouped-show-meta">
                                    <h4>{group.movieTitle}</h4>
                                    <p className="grouped-show-subtitle">{group.shows.length} showtime{group.shows.length !== 1 ? "s" : ""} scheduled</p>
                                    {movieObj && <span className="grouped-show-genre">{movieObj.genre}</span>}
                                  </div>
                                </div>
                                <div className="grouped-show-days">
                                  {Object.entries(dayGroups).map(([dayLabel, dayShows]) => (
                                    <div key={dayLabel} className="grouped-day-section">
                                      <span className="grouped-day-label">{dayLabel}</span>
                                      <div className="grouped-time-chips">
                                        {dayShows.map(s => (
                                          <button
                                            key={s.id}
                                            className="grouped-time-chip"
                                            onClick={() => setCancelShowModal(s)}
                                            title={`Click to manage — ₹${s.price}`}
                                          >
                                            <span className="chip-time">{s.showTime}</span>
                                            <span className="chip-price">₹{s.price}</span>
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          });
                        })()
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {activeOwnerTab === "bookings" && (
              <div className="owner-panel-section animate-fade-in">
                <section className="bookings-section">
                  <div className="section-header">
                    <h2>Audience Bookings Analytics</h2>
                    <p className="section-subtitle">Real-time seat reservations booked by platform users</p>
                  </div>

                  <div className="bookings-table-wrapper">
                    <table className="bookings-table">
                      <thead>
                        <tr>
                          <th>Booking ID</th>
                          <th>Movie Name</th>
                          <th>Showtime</th>
                          <th>Seat Reserved</th>
                          <th>Price Amount</th>
                          <th>Reservation Timestamp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((booking) => (
                          <tr key={booking.id}>
                            <td className="ticket-id">#{booking.id}</td>
                            <td className="ticket-title">{booking.movieTitle}</td>
                            <td className="ticket-time">{booking.showTime}</td>
                            <td className="ticket-seat">
                              <span className="seat-badge">{booking.seatNumber}</span>
                            </td>
                            <td className="ticket-price">₹{booking.price.toFixed(2)}</td>
                            <td className="ticket-date">
                              {new Date(booking.bookedAt).toLocaleString(undefined, {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            )}
          </div>

          {/* Cancel Show Confirmation Modal */}
          {cancelShowModal && (
            <div className="cancel-modal-overlay" onClick={() => setCancelShowModal(null)}>
              <div className="cancel-modal-card" onClick={e => e.stopPropagation()}>
                <div className="cancel-modal-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </div>
                <h3>Cancel This Showtime?</h3>
                <p className="cancel-modal-desc">This action will permanently remove this showtime and free all reserved seats.</p>
                <div className="cancel-modal-details">
                  <div className="cancel-detail-row">
                    <span className="cancel-detail-label">Movie</span>
                    <span className="cancel-detail-value">{cancelShowModal.movieTitle}</span>
                  </div>
                  <div className="cancel-detail-row">
                    <span className="cancel-detail-label">Showtime</span>
                    <span className="cancel-detail-value">{cancelShowModal.showTime}</span>
                  </div>
                  <div className="cancel-detail-row">
                    <span className="cancel-detail-label">Ticket Price</span>
                    <span className="cancel-detail-value">₹{cancelShowModal.price}</span>
                  </div>
                  <div className="cancel-detail-row">
                    <span className="cancel-detail-label">Day</span>
                    <span className="cancel-detail-value">{cancelShowModal.dayOffset === 0 ? "Today" : cancelShowModal.dayOffset === 1 ? "Tomorrow" : `Day +${cancelShowModal.dayOffset}`}</span>
                  </div>
                  <div className="cancel-detail-row">
                    <span className="cancel-detail-label">Cinema</span>
                    <span className="cancel-detail-value">{cancelShowModal.cinema}</span>
                  </div>
                </div>
                <div className="cancel-modal-actions">
                  <button className="cancel-modal-btn btn-dismiss" onClick={() => setCancelShowModal(null)}>Keep Show</button>
                  <button className="cancel-modal-btn btn-confirm-cancel" onClick={handleDeleteShow}>Cancel Show</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}


      {/* ================= ADMIN PANEL ================= */}
      {role === "admin" && (
        <div className="admin-dashboard-wrapper">
          <div className="admin-sidebar-nav">
            <div className="sidebar-brand">Admin Control Panel</div>
            <button className={`sidebar-btn ${activeAdminTab === "overview" ? "active" : ""}`} onClick={() => setActiveAdminTab("overview")}>
              System Overview
            </button>
            <button className={`sidebar-btn ${activeAdminTab === "users" ? "active" : ""}`} onClick={() => setActiveAdminTab("users")}>
              User Accounts ({allUsers.length})
            </button>
            <button className={`sidebar-btn ${activeAdminTab === "approvals" ? "active" : ""}`} onClick={() => setActiveAdminTab("approvals")}>
              Theatre Approvals
            </button>
            <button className={`sidebar-btn ${activeAdminTab === "reviews" ? "active" : ""}`} onClick={() => setActiveAdminTab("reviews")}>
              Moderation
            </button>
          </div>

          <div className="admin-main-content">
            <header className="admin-content-header">
              <h1>System Control Center</h1>
              <p>Platform level user management, security controls, and moderation tools</p>
            </header>

            {activeAdminTab === "overview" && (
              <div className="admin-panel-section animate-fade-in">
                {/* Stats Cards */}
                <div className="stats-grid-cards">
                  <div className="stat-card-item purple">
                    <div className="stat-info">
                      <span className="stat-num">{allUsers.length}</span>
                      <span className="stat-label">Registered Users</span>
                    </div>
                  </div>
                  <div className="stat-card-item green">
                    <div className="stat-info">
                      <span className="stat-num">{bookings.length}</span>
                      <span className="stat-label">Total Platform Bookings</span>
                    </div>
                  </div>
                  <div className="stat-card-item orange">
                    <div className="stat-info">
                      <span className="stat-num">₹{bookings.reduce((sum, b) => sum + (b.price || 0), 0).toLocaleString()}</span>
                      <span className="stat-label">Platform Fees Revenue</span>
                    </div>
                  </div>
                  <div className="stat-card-item blue">
                    <div className="stat-info">
                      <span className="stat-num">{approvalsList.filter(a => a.status === "Pending").length}</span>
                      <span className="stat-label">Pending Approvals</span>
                    </div>
                  </div>
                </div>

                {/* Audit logs & system logs terminal */}
                <div className="admin-console-card">
                  <h3>Real-Time System Logs</h3>
                  <div className="logs-terminal-box">
                    {systemLogs.map((log, index) => (
                      <div key={index} className="log-line-item">
                        <span className="log-timestamp">[{log.time}]</span>
                        <span className="log-tag">INFO</span>
                        <span className="log-message">{log.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeAdminTab === "users" && (
              <div className="admin-panel-section animate-fade-in">
                <section className="bookings-section">
                  <div className="section-header">
                    <h2>Manage Platform User Accounts</h2>
                    <p className="section-subtitle">Modify user security permissions and assign system roles</p>
                  </div>

                  {/* Search and Filters Bar */}
                  <div className="admin-filters-row">
                    <div className="search-box-wrapper">
                      <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                      <input 
                        type="text" 
                        placeholder="Search users by name or email..." 
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                        className="admin-search-input"
                      />
                    </div>
                    <div className="filter-select-wrapper">
                      <label>Role Filter</label>
                      <select 
                        value={userRoleFilter} 
                        onChange={(e) => setUserRoleFilter(e.target.value)}
                        className="admin-filter-select"
                      >
                        <option value="ALL">All Roles</option>
                        <option value="USER">USER</option>
                        <option value="THEATRE_OWNER">THEATRE_OWNER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </div>
                  </div>

                  <div className="bookings-table-wrapper">
                    <table className="bookings-table">
                      <thead>
                        <tr>
                          <th>User ID</th>
                          <th>Full Name</th>
                          <th>Email Address</th>
                          <th>Assigned Role</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="empty-table-placeholder">
                              No users found matching your search criteria.
                            </td>
                          </tr>
                        ) : (
                          filteredUsers.map((u) => (
                            <tr key={u.id}>
                              <td className="ticket-id">#{u.id}</td>
                              <td className="ticket-title">{u.name}</td>
                              <td className="ticket-time">{u.email}</td>
                              <td className="ticket-seat">
                                <div className="role-badge-group">
                                  <button 
                                    className={`role-badge-btn user ${u.role === "USER" ? "active" : ""}`}
                                    onClick={() => handleUserRoleChange(u.id, u.email, "USER")}
                                  >
                                    User
                                  </button>
                                  <button 
                                    className={`role-badge-btn owner ${u.role === "THEATRE_OWNER" ? "active" : ""}`}
                                    onClick={() => handleUserRoleChange(u.id, u.email, "THEATRE_OWNER")}
                                  >
                                    Owner
                                  </button>
                                  <button 
                                    className={`role-badge-btn admin ${u.role === "ADMIN" ? "active" : ""}`}
                                    onClick={() => handleUserRoleChange(u.id, u.email, "ADMIN")}
                                  >
                                    Admin
                                  </button>
                                </div>
                              </td>
                              <td>
                                {confirmBanUserId === u.id ? (
                                  <div className="ban-confirm-group">
                                    <button className="btn-confirm-yes" onClick={() => { handleBanUser(u.id, u.email); setConfirmBanUserId(null); }}>Confirm</button>
                                    <button className="btn-confirm-no" onClick={() => setConfirmBanUserId(null)}>Cancel</button>
                                  </div>
                                ) : (
                                  <button className="admin-btn-ban" onClick={() => setConfirmBanUserId(u.id)}>Ban / Delete</button>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            )}

            {activeAdminTab === "approvals" && (
              <div className="admin-panel-section animate-fade-in">
                <section className="bookings-section">
                  <div className="section-header">
                    <h2>Theatre Registration Approvals</h2>
                    <p className="section-subtitle">Review and authorize new cinema halls registering on the platform</p>
                  </div>

                  <div className="bookings-table-wrapper">
                    <table className="bookings-table">
                      <thead>
                        <tr>
                          <th>Request ID</th>
                          <th>Theatre Name</th>
                          <th>City Location</th>
                          <th>Registered Owner</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {approvalsList.map((app) => (
                          <tr key={app.id}>
                            <td className="ticket-id">#{app.id}</td>
                            <td className="ticket-title">{app.name}</td>
                            <td className="ticket-time">{app.city}</td>
                            <td className="ticket-date">{app.owner}</td>
                            <td className="ticket-seat">
                              <span className={`status-badge-role ${app.status.toLowerCase()}`}>{app.status}</span>
                            </td>
                            <td>
                              {app.status === "Pending" ? (
                                <div className="admin-btn-group-actions">
                                  <button className="btn-action-approve" onClick={() => handleApproveTheatre(app.id, app.name)}>Approve</button>
                                  <button className="btn-action-reject" onClick={() => handleRejectTheatre(app.id, app.name)}>Reject</button>
                                </div>
                              ) : (
                                <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No action required</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            )}

            {activeAdminTab === "reviews" && (
              <div className="admin-panel-section animate-fade-in">
                <section className="bookings-section">
                  <div className="section-header">
                    <h2>Review Content Moderation</h2>
                    <p className="section-subtitle">Filter spam, links, and remove inappropriate user ratings</p>
                  </div>

                  <div className="bookings-table-wrapper">
                    <table className="bookings-table">
                      <thead>
                        <tr>
                          <th>Movie Name</th>
                          <th>User Email</th>
                          <th>Rating Score</th>
                          <th>Comment Text</th>
                          <th>Flag Level</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reviews.map((rev) => (
                          <tr key={rev.id}>
                            <td className="ticket-title">{rev.movieTitle}</td>
                            <td className="ticket-time">{rev.author}</td>
                            <td className="ticket-seat">
                              <span style={{ color: "#ffc107" }}>{"★".repeat(rev.rating)}</span>
                            </td>
                            <td className="ticket-date" style={{ maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              "{rev.comment}"
                            </td>
                            <td className="ticket-seat">
                              <span className={`flag-status-pill ${rev.isSpam ? "spam-flag" : "safe-flag"}`}>
                                {rev.isSpam ? "Spam Detected" : "Verified"}
                              </span>
                            </td>
                            <td>
                              <button className="admin-btn-ban" onClick={() => handleRemoveReview(rev.id, rev.movieTitle)}>Remove Review</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
