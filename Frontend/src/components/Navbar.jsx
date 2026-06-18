import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/authStore";
import "./Navbar.css";

// 10 Popular Cities with their custom landmarks represented as custom inline SVG drawings
const POPULAR_CITIES = [
  {
    name: "Mumbai",
    icon: (
      <svg viewBox="0 0 100 80" className="city-svg" xmlns="http://www.w3.org/2000/svg">
        <path d="M20,70 L20,30 L35,30 L35,25 L45,25 L45,15 L55,15 L55,25 L65,25 L65,30 L80,30 L80,70 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M40,70 L40,42 Q50,32 60,42 L60,70" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="50" cy="10" r="2" fill="currentColor"/>
        <line x1="10" y1="70" x2="90" y2="70" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    name: "Delhi-NCR",
    icon: (
      <svg viewBox="0 0 100 80" className="city-svg" xmlns="http://www.w3.org/2000/svg">
        <path d="M25,70 L25,25 L35,25 L35,20 L65,20 L65,25 L75,25 L75,70 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M42,70 L42,45 C42,38 58,38 58,45 L58,70" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="30" y1="20" x2="70" y2="20" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <line x1="15" y1="70" x2="85" y2="70" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    name: "Bengaluru",
    icon: (
      <svg viewBox="0 0 100 80" className="city-svg" xmlns="http://www.w3.org/2000/svg">
        <path d="M15,70 L15,45 L35,45 L35,35 L45,35 L45,25 Q50,15 55,25 L55,35 L65,35 L65,45 L85,45 L85,70 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="50" cy="10" r="3" fill="none" stroke="currentColor" strokeWidth="2"/>
        <line x1="50" y1="13" x2="50" y2="25" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="10" y1="70" x2="90" y2="70" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    name: "Hyderabad",
    icon: (
      <svg viewBox="0 0 100 80" className="city-svg" xmlns="http://www.w3.org/2000/svg">
        <path d="M25,70 L25,35 L75,35 L75,70 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M38,70 L38,50 C38,42 62,42 62,50 L62,70" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M20,70 L20,20 L27,20 L27,70 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M73,70 L73,20 L80,20 L80,70 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="23.5" cy="15" r="3" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="76.5" cy="15" r="3" fill="none" stroke="currentColor" strokeWidth="2"/>
        <line x1="10" y1="70" x2="90" y2="70" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    name: "Chandigarh",
    icon: (
      <svg viewBox="0 0 100 80" className="city-svg" xmlns="http://www.w3.org/2000/svg">
        <path d="M40,70 L60,70 L58,55 L42,55 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="50" y1="55" x2="50" y2="40" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <path d="M50,40 C43,38 34,32 34,24 C34,18 40,16 45,21 C45,12 51,9 54,13 C58,9 62,11 63,17 C66,13 70,16 69,22 C68,28 58,38 50,40 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="15" y1="70" x2="85" y2="70" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    name: "Ahmedabad",
    icon: (
      <svg viewBox="0 0 100 80" className="city-svg" xmlns="http://www.w3.org/2000/svg">
        <path d="M20,70 L20,40 C20,20 80,20 80,40 L80,70" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M30,70 L30,40 C30,25 70,25 70,40 L70,70" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M50,70 L50,20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2"/>
        <path d="M20,40 L80,40" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2"/>
        <line x1="10" y1="70" x2="90" y2="70" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    name: "Pune",
    icon: (
      <svg viewBox="0 0 100 80" className="city-svg" xmlns="http://www.w3.org/2000/svg">
        <path d="M15,70 L15,40 L30,40 L35,30 L65,30 L70,40 L85,40 L85,70 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M43,70 L43,50 C43,45 57,45 57,50 L57,70" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="30" y1="40" x2="30" y2="70" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="70" y1="40" x2="70" y2="70" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="10" y1="70" x2="90" y2="70" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    name: "Chennai",
    icon: (
      <svg viewBox="0 0 100 80" className="city-svg" xmlns="http://www.w3.org/2000/svg">
        <path d="M30,70 L35,45 L45,45 L48,25 L52,25 L55,45 L65,45 L70,70 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15,70 L18,55 L25,55 L28,70" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="50" cy="20" r="2" fill="currentColor"/>
        <circle cx="21.5" cy="51" r="1.5" fill="currentColor"/>
        <line x1="10" y1="70" x2="90" y2="70" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    name: "Kolkata",
    icon: (
      <svg viewBox="0 0 100 80" className="city-svg" xmlns="http://www.w3.org/2000/svg">
        <path d="M25,70 L30,20 L35,20 L40,70 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M60,70 L65,20 L70,20 L75,70 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="10" y1="60" x2="90" y2="60" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M10,35 Q32,60 50,60 Q68,60 90,35" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M32,20 C40,40 60,40 68,20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="10" y1="70" x2="90" y2="70" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    name: "Kochi",
    icon: (
      <svg viewBox="0 0 100 80" className="city-svg" xmlns="http://www.w3.org/2000/svg">
        <line x1="20" y1="70" x2="60" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="35" y1="70" x2="50" y2="45" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M60,30 Q75,25 85,45" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M60,30 Q70,45 65,60" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="85" y1="45" x2="65" y2="60" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeDasharray="1 1"/>
        <line x1="60" y1="30" x2="73" y2="52" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
        <line x1="10" y1="70" x2="90" y2="70" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, role, user } = useAuth();
  
  // Search parameters for global input sync
  const [searchParams, setSearchParams] = useSearchParams();
  const searchValFromUrl = searchParams.get("search") || "";
  const [searchVal, setSearchVal] = useState(searchValFromUrl);
  
  const activeUserTab = searchParams.get("tab") || "home";

  // Watchlist & Bookings counts state
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [bookingsCount, setBookingsCount] = useState(0);

  useEffect(() => {
    const updateWatchlist = () => {
      const saved = localStorage.getItem("watchlist");
      const list = saved ? JSON.parse(saved) : [];
      setWatchlistCount(list.length);
    };

    updateWatchlist();
    window.addEventListener("watchlistUpdated", updateWatchlist);
    window.addEventListener("storage", updateWatchlist);

    const handleBookingsUpdate = (e) => {
      if (e.detail !== undefined) {
        setBookingsCount(e.detail);
      }
    };
    window.addEventListener("bookingsUpdated", handleBookingsUpdate);

    return () => {
      window.removeEventListener("watchlistUpdated", updateWatchlist);
      window.removeEventListener("storage", updateWatchlist);
      window.removeEventListener("bookingsUpdated", handleBookingsUpdate);
    };
  }, []);

  const handleTabClick = (tabName) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("tab", tabName);
    setSearchParams(newParams);
  };

  // City States
  const [selectedCity, setSelectedCity] = useState(
    () => localStorage.getItem("selectedCity") || "Chandigarh"
  );
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");

  // Drawer / Menu State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Sync search input if url updates externally
  useEffect(() => {
    setSearchVal(searchValFromUrl);
  }, [searchValFromUrl]);

  const handleLogout = async () => {
    await logout();
    setIsDrawerOpen(false);
    navigate("/");
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchVal(value);
    
    // Live update if already on movies page
    if (location.pathname === "/movies") {
      if (value) {
        setSearchParams({ search: value });
      } else {
        setSearchParams({});
      }
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      if (location.pathname !== "/movies") {
        navigate(`/movies?search=${encodeURIComponent(searchVal)}`);
      }
    }
  };

  const handleCitySelect = (cityName) => {
    setSelectedCity(cityName);
    localStorage.setItem("selectedCity", cityName);
    setIsCityModalOpen(false);
    setCitySearch("");
    window.dispatchEvent(new Event("cityChanged"));
  };

  // Filter cities by search term
  const filteredCities = POPULAR_CITIES.filter((c) =>
    c.name.toLowerCase().includes(citySearch.toLowerCase())
  );

  return (
    <>
      <nav className="navbar-new">
        {/* Row 1: Brand, Search Bar, Location, Sign In, Hamburger */}
        <div className="navbar-top-row">
          <div className="navbar-top-container">
            <h2 className="navbar-logo" onClick={() => navigate("/dashboard")}>
              Cine<span className="logo-highlight">Verse</span>
            </h2>

            <div className="navbar-search-wrapper">
              <span className="navbar-search-icon">
                <svg stroke="currentColor" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.1em" width="1.1em" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search for Movies, Events, Plays, Sports and Activities"
                value={searchVal}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                className="navbar-search-input"
              />
            </div>

            <div className="navbar-actions-group">
              {/* City Selector Dropdown Trigger */}
              <div 
                className="navbar-city-trigger" 
                onClick={() => setIsCityModalOpen(true)}
                title="Select location"
              >
                <span>{selectedCity}</span>
                <span className="city-chevron">▾</span>
              </div>

              {/* User profile / Logout layout */}
              {user ? (
                <div className="navbar-user-section">
                  <div className="navbar-avatar-circle" title={`${user.name} (${role})`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <button className="navbar-btn-primary" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              ) : (
                <button className="navbar-btn-primary" onClick={() => navigate("/login")}>
                  Sign In
                </button>
              )}

              {/* Hamburger Toggle Menu */}
              <button 
                className={`navbar-hamburger ${isDrawerOpen ? "open" : ""}`} 
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                aria-label="Toggle Navigation Drawer"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Secondary links layout */}
        <div className="navbar-bottom-row">
          <div className="navbar-bottom-container">
            <div className="navbar-links-left">
              <Link to="/movies" className={location.pathname === "/movies" ? "nav-link active" : "nav-link"}>
                Movies
              </Link>
              
              <Link to="/dashboard" className={location.pathname === "/dashboard" ? "nav-link active" : "nav-link"}>
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Slide-out Mobile/Side Drawer Panel */}
      {isDrawerOpen && (
        <div className="navbar-drawer-overlay" onClick={() => setIsDrawerOpen(false)}>
          <div className="navbar-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>Menu Options</h3>
              <button className="drawer-close" onClick={() => setIsDrawerOpen(false)}>&times;</button>
            </div>
            <div className="drawer-body">
              {user && (
                <div className="drawer-user-info">
                  <div className="drawer-avatar">{user.name.charAt(0).toUpperCase()}</div>
                  <div>
                    <div className="drawer-username">{user.name}</div>
                    <div className="drawer-role">{role}</div>
                  </div>
                </div>
              )}
              <div className="drawer-links">
                <Link to="/dashboard" onClick={() => setIsDrawerOpen(false)}>
                  Dashboard
                </Link>
                <Link to="/movies" onClick={() => setIsDrawerOpen(false)}>
                  Explore Movies
                </Link>
                <Link to="/booking" onClick={() => setIsDrawerOpen(false)}>
                  Booking Center
                </Link>
              </div>
              <div className="drawer-footer">
                {user ? (
                  <button className="drawer-logout-btn" onClick={handleLogout}>
                    Sign Out
                  </button>
                ) : (
                  <button className="drawer-logout-btn" onClick={() => { setIsDrawerOpen(false); navigate("/login"); }}>
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Select City Dropdown Modal Dialog */}
      {isCityModalOpen && (
        <div className="city-modal-overlay" onClick={() => setIsCityModalOpen(false)}>
          <div className="city-modal-card" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="city-modal-header">
              <div className="city-search-box-wrapper">
                <span className="city-search-icon">
                  <svg stroke="currentColor" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.1em" width="1.1em" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search for your city"
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  className="city-search-input"
                  autoFocus
                />
              </div>
              <button className="city-modal-close" onClick={() => setIsCityModalOpen(false)}>
                &times;
              </button>
            </div>

            {/* Popular Cities list */}
            <div className="city-modal-divider">Popular Cities</div>

            <div className="cities-grid">
              {filteredCities.map((city) => {
                const normalizedCity = city.name.toLowerCase();
                const normalizedSelected = selectedCity.toLowerCase();
                const isActive = normalizedSelected === normalizedCity || 
                                 (normalizedCity === "chandigarh" && (normalizedSelected === "mohali" || normalizedSelected === "zirakpur"));

                return (
                  <button
                    key={city.name}
                    className={`city-item-btn ${isActive ? "active" : ""}`}
                    onClick={() => handleCitySelect(city.name)}
                  >
                    <div className="city-landmark-svg">
                      {city.icon}
                    </div>
                    <span className="city-item-label">{city.name}</span>
                  </button>
                );
              })}

              {filteredCities.length === 0 && (
                <div className="no-cities-found">
                  No popular cities found matching "{citySearch}"
                </div>
              )}
            </div>

            {/* Chandigarh sub-towns selection bar */}
            {(selectedCity.toLowerCase() === "chandigarh" || 
              selectedCity.toLowerCase() === "mohali" || 
              selectedCity.toLowerCase() === "zirakpur") && (
              <div className="sub-towns-bar animate-slide-up">
                <span className="sub-towns-label">Nearby regions:</span>
                <button 
                  className={`sub-town-chip ${selectedCity.toLowerCase() === "mohali" ? "active" : ""}`}
                  onClick={() => handleCitySelect("Mohali")}
                >
                  Mohali
                </button>
                <button 
                  className={`sub-town-chip ${selectedCity.toLowerCase() === "zirakpur" ? "active" : ""}`}
                  onClick={() => handleCitySelect("Zirakpur")}
                >
                  Zirakpur
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
