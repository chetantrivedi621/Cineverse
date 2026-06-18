import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getBookingOptions, getMovieShows, getBookedSeats, createBooking, lockSeat, unlockSeat } from "../services/api";
import "./Booking.css";

// 1. Static Cinema Listings per City/Area
const CINEMAS_BY_CITY = {
  "chandigarh": [
    { id: "c1", name: "PVR: Elante, Chandigarh", logo: "PVR", type: "M-Ticket", cancel: "Cancellation available" },
    { id: "c2", name: "Cinepolis: TDI Mall, Chandigarh", logo: "Cinepolis", type: "M-Ticket", cancel: "Non-cancellable" },
    { id: "c3", name: "PVR: Centra Mall, Chandigarh", logo: "PVR", type: "M-Ticket", cancel: "Cancellation available" }
  ],
  "mohali": [
    { id: "m1", name: "PVR: CP67 Mall, Mohali", logo: "PVR", type: "M-Ticket", cancel: "Cancellation available" },
    { id: "m2", name: "Cinepolis: Bestech Square, Mohali", logo: "Cinepolis", type: "M-Ticket", cancel: "Non-cancellable" },
    { id: "m3", name: "PVR: MOHALI WALK", logo: "PVR", type: "M-Ticket", cancel: "Cancellation available" }
  ],
  "zirakpur": [
    { id: "z1", name: "PVR: Cosmo Mall, Zirakpur", logo: "PVR", type: "M-Ticket", cancel: "Cancellation available" },
    { id: "z2", name: "INOX: Dhillon Plaza, Zirakpur", logo: "INOX", type: "M-Ticket", cancel: "Non-cancellable" }
  ],
  "mumbai": [
    { id: "mum1", name: "PVR: Dynamix Mall, Juhu, Mumbai", logo: "PVR", type: "M-Ticket", cancel: "Cancellation available" },
    { id: "mum2", name: "Cinepolis: Fun Republic, Andheri, Mumbai", logo: "Cinepolis", type: "M-Ticket", cancel: "Non-cancellable" },
    { id: "mum3", name: "INOX: Inorbit Mall, Malad, Mumbai", logo: "INOX", type: "M-Ticket", cancel: "Cancellation available" }
  ],
  "delhi-ncr": [
    { id: "del1", name: "PVR: Director's Cut, Ambience Mall, Vasant Kunj", logo: "PVR", type: "M-Ticket", cancel: "Cancellation available" },
    { id: "del2", name: "PVR: Plaza, Connaught Place, Delhi", logo: "PVR", type: "M-Ticket", cancel: "Non-cancellable" },
    { id: "del3", name: "Cinepolis: DLF Avenue, Saket, Delhi", logo: "Cinepolis", type: "M-Ticket", cancel: "Cancellation available" }
  ],
  "bengaluru": [
    { id: "blr1", name: "PVR: Forum Mall, Koramangala, Bengaluru", logo: "PVR", type: "M-Ticket", cancel: "Cancellation available" },
    { id: "blr2", name: "Cinepolis: Royal Meenakshi Mall, Bengaluru", logo: "Cinepolis", type: "M-Ticket", cancel: "Non-cancellable" },
    { id: "blr3", name: "PVR: Phoenix Marketcity, Whitefield, Bengaluru", logo: "PVR", type: "M-Ticket", cancel: "Cancellation available" }
  ],
  "hyderabad": [
    { id: "hyd1", name: "PVR: Forum Sujana Mall, Kukatpally, Hyderabad", logo: "PVR", type: "M-Ticket", cancel: "Cancellation available" },
    { id: "hyd2", name: "Cinepolis: Mantra Mall, Attapur, Hyderabad", logo: "Cinepolis", type: "M-Ticket", cancel: "Non-cancellable" },
    { id: "hyd3", name: "Prasads Multiplex, Hyderabad", logo: "PRASADS", type: "M-Ticket", cancel: "Cancellation available" }
  ],
  "ahmedabad": [
    { id: "ahd1", name: "PVR: Acropolis Mall, Ahmedabad", logo: "PVR", type: "M-Ticket", cancel: "Cancellation available" },
    { id: "ahd2", name: "Cinepolis: Alpha One Mall, Vastrapur, Ahmedabad", logo: "Cinepolis", type: "M-Ticket", cancel: "Non-cancellable" }
  ],
  "pune": [
    { id: "pne1", name: "PVR: Phoenix Marketcity, Viman Nagar, Pune", logo: "PVR", type: "M-Ticket", cancel: "Cancellation available" },
    { id: "pne2", name: "Cinepolis: Westend Mall, Aundh, Pune", logo: "Cinepolis", type: "M-Ticket", cancel: "Non-cancellable" }
  ],
  "chennai": [
    { id: "chn1", name: "PVR: Ampa Skywalk Mall, Aminjikarai, Chennai", logo: "PVR", type: "M-Ticket", cancel: "Cancellation available" },
    { id: "chn2", name: "Sathyam Cinemas: Royapettah, Chennai", logo: "SPI", type: "M-Ticket", cancel: "Non-cancellable" }
  ],
  "kolkata": [
    { id: "kol1", name: "PVR: Mani Square Mall, Kolkata", logo: "PVR", type: "M-Ticket", cancel: "Cancellation available" },
    { id: "kol2", name: "Cinepolis: Acropolis Mall, Kolkata", logo: "Cinepolis", type: "M-Ticket", cancel: "Non-cancellable" }
  ],
  "kochi": [
    { id: "koc1", name: "PVR: Lulu Mall, Edappally, Kochi", logo: "PVR", type: "M-Ticket", cancel: "Cancellation available" },
    { id: "koc2", name: "Cinepolis: Centre Square Mall, Kochi", logo: "Cinepolis", type: "M-Ticket", cancel: "Non-cancellable" }
  ]
};

const getCinemasForCity = (city) => {
  const normalized = city.toLowerCase();
  return CINEMAS_BY_CITY[normalized] || CINEMAS_BY_CITY["chandigarh"];
};

// Generate 7 upcoming dates starting from current local time
const getNext7Days = () => {
  const days = [];
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const months = ["JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC", "JAN", "FEB", "MAR", "APR", "MAY"];
  
  for (let i = 0; i < 7; i++) {
    const d = new Date(Date.now() + i * msPerDay);
    days.push({
      id: i,
      dayName: daysOfWeek[d.getDay()],
      dayNum: d.getDate(),
      month: months[d.getMonth()],
      fullString: d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })
    });
  }
  return days;
};

const isShowtimePast = (timeStr, dateIndex) => {
  // If it's a future day, it is never in the past!
  if (dateIndex > 0) return false;

  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return false;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();

  if (ampm === "PM" && hours < 12) {
    hours += 12;
  } else if (ampm === "AM" && hours === 12) {
    hours = 0;
  }

  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();

  if (currentHours > hours) {
    return true;
  }
  if (currentHours === hours && currentMinutes >= minutes) {
    return true;
  }
  return false;
};

const convertTimeToMinutes = (timeStr) => {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();
  
  if (ampm === "PM" && hours < 12) {
    hours += 12;
  } else if (ampm === "AM" && hours === 12) {
    hours = 0;
  }
  return hours * 60 + minutes;
};

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const stateMovieId = location.state?.movieId;

  const [movies, setMovies] = useState([]);
  const [seats, setSeats] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [shows, setShows] = useState([]);
  const [selectedShowId, setSelectedShowId] = useState("");
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [ticketCount, setTicketCount] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // BookMyShow Showtimes & Area Selection States
  const [selectedCity, setSelectedCity] = useState(
    () => localStorage.getItem("selectedCity") || "Chandigarh"
  );
  const [selectedCinema, setSelectedCinema] = useState("");
  const [selectedTimeLabel, setSelectedTimeLabel] = useState("");
  const [selectedDateLabel, setSelectedDateLabel] = useState("");
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [hoveredShowId, setHoveredShowId] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState("select");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isSeatCountPopupOpen, setIsSeatCountPopupOpen] = useState(false);
  const [pendingShowId, setPendingShowId] = useState(null);
  const [pendingCinemaName, setPendingCinemaName] = useState("");
  const [pendingTimeLabel, setPendingTimeLabel] = useState("");

  const datesList = getNext7Days();

  // Listen to city changes dynamically from Navbar
  useEffect(() => {
    const handleCityChange = () => {
      const newCity = localStorage.getItem("selectedCity") || "Chandigarh";
      setSelectedCity(newCity);
      // Reset show selection if city changes to update cinemas
      handleBackToShowtimes();
    };
    window.addEventListener("cityChanged", handleCityChange);
    return () => window.removeEventListener("cityChanged", handleCityChange);
  }, []);

  // Initial load
  useEffect(() => {
    getBookingOptions().then((bookingOptions) => {
      setMovies(bookingOptions.movies);
      setSeats(bookingOptions.seats);
      
      // Preselect movie if passed in state, otherwise default to first movie
      if (stateMovieId) {
        setSelectedMovieId(String(stateMovieId));
      } else if (bookingOptions.movies.length > 0) {
        setSelectedMovieId(String(bookingOptions.movies[0].id));
      }
    });
  }, [stateMovieId]);

  // Fetch shows when movie, city, or date changes
  useEffect(() => {
    if (selectedMovieId) {
      getMovieShows(selectedMovieId, selectedCity, selectedDateIndex).then((movieShows) => {
        setShows(movieShows);
        // Do NOT automatically select a show ID, user must select a cinema first
        setSelectedShowId("");
        setSelectedCinema("");
        setSelectedTimeLabel("");
        setSelectedDateLabel("");
        setSelectedSeats([]);
        setError("");
        setMessage("");
      });
    }
  }, [selectedMovieId, selectedCity, selectedDateIndex]);

  // Fetch booked seats when show changes, and poll every 5 seconds to keep in sync
  useEffect(() => {
    let intervalId;
    if (selectedShowId) {
      setSelectedSeats([]);
      getBookedSeats(selectedShowId).then((booked) => {
        setBookedSeats(booked);
      });

      intervalId = setInterval(() => {
        getBookedSeats(selectedShowId).then((booked) => {
          setBookedSeats((prev) => {
            if (JSON.stringify(prev) !== JSON.stringify(booked)) {
              return booked;
            }
            return prev;
          });
        });
      }, 5000);
    } else {
      setBookedSeats([]);
      setSelectedSeats([]);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [selectedShowId]);

  const selectedSeatsRef = useRef([]);
  const selectedShowIdRef = useRef("");

  useEffect(() => {
    selectedSeatsRef.current = selectedSeats;
    selectedShowIdRef.current = selectedShowId;
  }, [selectedSeats, selectedShowId]);

  // Deselect seats if they are booked by another user in the meantime
  useEffect(() => {
    if (selectedSeats.length > 0) {
      const availableSelected = selectedSeats.filter((s) => !bookedSeats.includes(s));
      if (availableSelected.length !== selectedSeats.length) {
        setSelectedSeats(availableSelected);
        setError("Some of your selected seats have been booked by another user.");
      }
    }
  }, [bookedSeats]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const showId = selectedShowIdRef.current;
      const seats = selectedSeatsRef.current;
      if (showId && seats.length > 0) {
        seats.forEach(s => {
          fetch(`/api/bookings/show/${showId}/unlock`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ showId, seatNumber: s }),
            keepalive: true
          }).catch(err => console.error(err));
        });
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      
      const showId = selectedShowIdRef.current;
      const seats = selectedSeatsRef.current;
      if (showId && seats.length > 0) {
        seats.forEach(s => {
          unlockSeat(showId, s).catch(err => console.error(err));
        });
      }
    };
  }, []);

  const selectedMovie = movies.find(
    (movie) => String(movie.id) === String(selectedMovieId)
  );

  const selectedShow = shows.find(
    (show) => String(show.id) === String(selectedShowId)
  );

  const getSeatPrice = (seat) => {
    if (!selectedShow) return 0;
    const base = selectedShow.price;
    if (seat.startsWith("A")) return base + 450.00;
    if (seat.startsWith("B")) return base + 50.00;
    return base; // Row C/D is Prime/Classic
  };

  const getTicketPriceAmount = () => {
    if (!selectedShow) return 0;
    if (selectedSeats.length === 0) {
      return selectedShow.price * ticketCount;
    }
    return selectedSeats.reduce((sum, seat) => sum + getSeatPrice(seat), 0);
  };

  // Click handler that automatically selects consecutive seats if available, otherwise falls back to individual selection
  const handleSeatClick = async (seat) => {
    const row = seat[0];
    const col = parseInt(seat.substring(1));
    
    // Check if consecutive seats are available starting from this seat
    const consecutiveSeats = [];
    let consecutiveAvailable = true;
    if (col + ticketCount - 1 <= 4) {
      for (let i = 0; i < ticketCount; i++) {
        const s = `${row}${col + i}`;
        if (bookedSeats.includes(s)) {
          consecutiveAvailable = false;
          break;
        }
        consecutiveSeats.push(s);
      }
    } else {
      consecutiveAvailable = false;
    }

    if (consecutiveAvailable) {
      // Choose the consecutive seats
      const oldSeats = [...selectedSeats];
      const newlyLocked = [];
      try {
        for (const s of consecutiveSeats) {
          if (!oldSeats.includes(s)) {
            await lockSeat(selectedShowId, s);
          }
          newlyLocked.push(s);
        }
        // Unlock old seats that are not part of the new selection
        for (const s of oldSeats) {
          if (!consecutiveSeats.includes(s)) {
            await unlockSeat(selectedShowId, s).catch(err => console.error(err));
          }
        }
        setSelectedSeats(consecutiveSeats);
        setError("");
        setMessage("");
      } catch (err) {
        for (const s of newlyLocked) {
          if (!oldSeats.includes(s)) {
            await unlockSeat(selectedShowId, s).catch(err => console.error(err));
          }
        }
        setError(err.response?.data || "Failed to hold seats. They might be temporarily held by another user.");
      }
    } else {
      // Fallback: Individual seat selection mode
      if (selectedSeats.includes(seat)) {
        try {
          await unlockSeat(selectedShowId, seat);
          setSelectedSeats(prev => prev.filter(s => s !== seat));
          setError("");
          setMessage("");
        } catch (err) {
          setError("Failed to release seat lock.");
        }
      } else {
        let newSeats = [...selectedSeats];
        
        // If we clicked a seat while consecutive seats were active elsewhere, and we want to start fresh with individual selection
        const areCurrentSeatsConsecutive = selectedSeats.length === ticketCount && 
          selectedSeats.every((s, i) => {
            if (i === 0) return true;
            return s[0] === selectedSeats[0][0] && parseInt(s.substring(1)) === parseInt(selectedSeats[0].substring(1)) + i;
          });

        if (areCurrentSeatsConsecutive) {
          // Clear consecutive selection to start a new individual selection
          for (const s of selectedSeats) {
            await unlockSeat(selectedShowId, s).catch(err => console.error(err));
          }
          newSeats = [];
        }

        // If we reached the ticket count limit, deselect the oldest individual seat to make room
        if (newSeats.length >= ticketCount) {
          const seatToUnlock = newSeats[0];
          try {
            await unlockSeat(selectedShowId, seatToUnlock);
            newSeats = newSeats.slice(1);
          } catch (err) {
            console.error("Failed to unlock oldest seat", err);
          }
        }
        
        try {
          await lockSeat(selectedShowId, seat);
          setSelectedSeats([...newSeats, seat]);
          setError("");
          setMessage("");
        } catch (err) {
          setError(err.response?.data || "Failed to hold seat. It might be temporarily held by another user.");
        }
      }
    }
  };

  const handleConfirmBooking = () => {
    if (!selectedShowId) {
      setError("Please select a valid show time.");
      return;
    }
    if (selectedSeats.length === 0) {
      setError("Please select your seats.");
      return;
    }

    setMessage("");
    setError("");
    setIsPaymentModalOpen(true);
    setPaymentStep("select");
  };

  const handleExecutePayment = async () => {
    setPaymentStep("processing");
    setError("");
    setMessage("");

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const results = [];
      for (const seat of selectedSeats) {
        const res = await createBooking(selectedShowId, seat);
        results.push(res);
      }
      
      const ticketIds = results.map((r) => r.id).join(", ");
      const successMsg = `Success! Booking confirmed. Ticket ID(s): ${ticketIds}`;
      setMessage(successMsg);
      setPaymentStep("success");
      
      // Refresh booked seats
      const updatedBooked = await getBookedSeats(selectedShowId);
      setBookedSeats(updatedBooked);
    } catch (err) {
      const status = err.response?.status;
      let errMsg;
      if (status === 403 || status === 401) {
        errMsg = "You must be signed in as a registered USER to book tickets. Please log in and try again.";
      } else {
        errMsg = err.response?.data?.message || err.message || "Booking failed. Please try again.";
      }
      setError(errMsg);
      setPaymentStep("failure");
    }
  };

  const handleFinishPayment = () => {
    setIsPaymentModalOpen(false);
    setSelectedSeats([]);
    navigate("/dashboard");
  };

  const handleBackToShowtimes = () => {
    setSelectedShowId("");
    setSelectedCinema("");
    setSelectedTimeLabel("");
    setSelectedDateLabel("");
    setSelectedSeats([]);
    setError("");
    setMessage("");
  };

  const handleSelectShowtime = (dbShowId, cinemaName, timeLabel) => {
    setPendingShowId(String(dbShowId));
    setPendingCinemaName(cinemaName);
    setPendingTimeLabel(timeLabel);
    setIsSeatCountPopupOpen(true);
    setError("");
    setMessage("");
  };

  const handleProceedToSeating = () => {
    setSelectedCinema(pendingCinemaName);
    setSelectedTimeLabel(pendingTimeLabel);
    setSelectedDateLabel(datesList[selectedDateIndex].fullString);
    setSelectedShowId(pendingShowId);
    setIsSeatCountPopupOpen(false);
    setSelectedSeats([]);
  };

  const handleEditTicketCount = () => {
    setPendingShowId(selectedShowId);
    setPendingCinemaName(selectedCinema);
    setPendingTimeLabel(selectedTimeLabel);
    setIsSeatCountPopupOpen(true);
  };

  const pendingShow = shows.find(s => String(s.id) === String(pendingShowId));
  const pendingCategories = pendingShow ? [
    { name: "RECLINER", price: pendingShow.price + 450.0, seats: ["A1", "A2", "A3", "A4"] },
    { name: "LOUNGER", price: pendingShow.price + 50.0, seats: ["B1", "B2", "B3", "B4"] },
    { name: "PRIME", price: pendingShow.price, seats: ["C1", "C2", "C3", "C4"] },
    { name: "CLASSIC", price: pendingShow.price, seats: ["D1", "D2", "D3", "D4"] }
  ] : [];

  const getBookedCount = (showObj) => (showObj?.bookedSeats || []).length;
  const getOccupancyPercent = (showObj) => Math.round((getBookedCount(showObj) / Math.max(seats.length, 1)) * 100);

  const getAvailabilityStatus = (showObj) => {
    const occupancy = getOccupancyPercent(showObj);
    if (occupancy >= 100) return { status: "sold-out", label: "Sold Out" };
    if (occupancy > 60) return { status: "almost-full", label: "Almost Full" };
    return { status: "available", label: "Available" };
  };

  const getCategoryAvailability = (bookedSeatsForShow, categorySeats) => {
    const bookedCount = categorySeats.filter(s => bookedSeatsForShow.includes(s)).length;
    const occupancy = Math.round((bookedCount / categorySeats.length) * 100);
    if (occupancy >= 100) return { status: "Sold Out", statusClass: "sold-out", popupClass: "sold" };
    if (occupancy > 60) return { status: "Fast Filling", statusClass: "almost-full", popupClass: "almost-full" };
    return { status: "Available", statusClass: "available", popupClass: "avail" };
  };

  // Helper to map visual showtimes to actual backend shows and visual details
  const getCinemaShowtimes = (cinema, cinemaIndex) => {
    if (shows.length === 0) return [];
    
    // Filter shows for this cinema
    const cinemaShows = shows.filter(show => 
      show.cinema && show.cinema.toLowerCase() === cinema.name.toLowerCase()
    );
    
    const slots = cinemaShows.map(showObj => {
      const hash = showObj.id;
      const availability = getAvailabilityStatus(showObj);
      const label = showObj.showTime;
      
      let tag = "";
      const tagSelector = hash % 5;
      if (tagSelector === 0) tag = "Cancellation available";
      else if (tagSelector === 1) tag = "KOTAK LUXE";
      else if (tagSelector === 2) tag = "Non-cancellable";

      return {
        label,
        status: availability.status,
        statusLabel: availability.label,
        tag,
        dbShowId: showObj.id,
        sortTime: convertTimeToMinutes(label)
      };
    });

    // Sort chronologically
    slots.sort((a, b) => a.sortTime - b.sortTime);
    return slots;
  };

  // Get all unique cinemas for the selected city (static ones + dynamically scheduled ones in shows)
  const getDynamicCinemas = () => {
    const staticCinemas = getCinemasForCity(selectedCity);
    
    // Extract unique cinema names from active shows
    const showCinemas = shows
      .map(s => s.cinema)
      .filter((value, index, self) => value && self.indexOf(value) === index);
      
    const dynamicList = [...staticCinemas];
    
    showCinemas.forEach(cinemaName => {
      // Check if it already exists in the static list
      const exists = staticCinemas.some(c => c.name.toLowerCase() === cinemaName.toLowerCase());
      if (!exists) {
        // Add to dynamic list
        dynamicList.push({
          id: `dyn-${cinemaName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
          name: cinemaName,
          logo: cinemaName.toUpperCase().includes("CINEPOLIS") ? "Cinepolis" : cinemaName.toUpperCase().includes("INOX") ? "INOX" : "PVR",
          type: "M-Ticket",
          cancel: "Cancellation available"
        });
      }
    });
    
    return dynamicList;
  };

  const cinemasList = getDynamicCinemas();

  return (
    <div className="booking-page-container">
      <Navbar />

      {/* Screen Mode A: Showtimes Selector */}
      {!selectedShowId ? (
        <div className="showtimes-selection-mode">
          
          {/* Header Panel */}
          <div className="booking-movie-header">
            <div className="booking-header-content">
              <div className="booking-header-left">
                <h1>{selectedMovie?.title || "Select Movie"} - (English)</h1>
                <div className="booking-meta-badges">
                  <span className="runtime-badge">Movie runtime: {selectedMovie?.duration || "1h 50m"}</span>
                  <span className="rating-cert-badge">
                    {selectedMovie?.title === "Obsession" || selectedMovie?.title === "Animal" ? "A" : "UA"}
                  </span>
                  {selectedMovie?.genre && selectedMovie.genre.split(",").map((genre) => (
                    <span key={genre} className="genre-badge-chip">{genre.trim()}</span>
                  ))}
                </div>
              </div>

              {/* Movie Change Picker */}
              <div className="movie-picker-container">
                <label htmlFor="movie-select-picker">Select Movie</label>
                <select
                  id="movie-select-picker"
                  value={selectedMovieId}
                  onChange={(e) => setSelectedMovieId(e.target.value)}
                  className="movie-picker-select"
                >
                  {movies.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Date Slider & Filter Bar */}
          <div className="date-filter-bar">
            <div className="date-filter-container">
              {/* Date Strip */}
              <div className="dates-strip-wrapper">
                {datesList.map((d, index) => {
                  const isSelected = selectedDateIndex === index;
                  return (
                    <button
                      key={d.id}
                      className={`date-strip-btn ${isSelected ? "active" : ""}`}
                      onClick={() => setSelectedDateIndex(index)}
                    >
                      <span className="date-day-name">{d.dayName}</span>
                      <span className="date-day-num">{d.dayNum}</span>
                      <span className="date-month-name">{d.month}</span>
                    </button>
                  );
                })}
              </div>

              <div className="horizontal-filters-list">
                <span className="filter-badge-lang">English • 2D</span>
                <span className="filter-search-icon">
                  <svg stroke="currentColor" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.1em" width="1.1em" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* Legends Sub-bar */}
          <div className="booking-legends-row">
            <div className="legends-inner">
              <div className="legends-left">
                <span>Late night shows</span>
                <span>Early morning shows</span>
              </div>
              <div className="legends-right">
                <span><span className="legend-dot green"></span> AVAILABLE</span>
                <span><span className="legend-dot yellow"></span> FAST FILLING</span>
                <span><span className="legend-dot yellow"></span> ALMOST FULL</span>
              </div>
            </div>
          </div>

          {/* Main Cinemas Listing */}
          <main className="cinemas-list-layout">
            <div className="cinemas-list-card">
              {shows.length === 0 ? (
                <div className="empty-cinemas-alert">
                  No showtimes available for the selected movie. Please select another movie.
                </div>
              ) : (
                cinemasList.map((cinema, idx) => {
                  const slots = getCinemaShowtimes(cinema, idx);
                  return (
                    <div key={cinema.name} className="cinema-row-item">
                      {/* Left: Cinema Info */}
                      <div className="cinema-info-block">
                        <div className="cinema-brand-title">
                          <span className={`cinema-logo-badge ${cinema.logo.toLowerCase()}`}>
                            {cinema.logo}
                          </span>
                          <h4 className="cinema-name-text">{cinema.name}</h4>
                          <span className="info-circle-icon" title="Cinema Info">ⓘ</span>
                        </div>
                        <div className="cinema-attributes">
                          <span className="mticket-badge">M-Ticket</span>
                          <span className="fns-badge">Food & Beverage</span>
                          <span className="fav-heart-icon" title="Add to favorites">♡</span>
                        </div>
                      </div>

                      {/* Right: Showtimes Buttons */}
                      <div className="cinema-showtimes-block">
                        {slots.map((slot) => {
                          const isPast = isShowtimePast(slot.label, selectedDateIndex);
                          const isUnavailable = slot.status === "sold-out";
                          return (
                            <div 
                              key={slot.label} 
                              className="showtime-btn-container"
                              onMouseEnter={() => setHoveredShowId(slot.dbShowId)}
                              onMouseLeave={() => setHoveredShowId(null)}
                            >
                              <button
                                className={`showtime-item-btn ${isPast ? "past" : slot.status}`}
                                onClick={() => !isPast && !isUnavailable && handleSelectShowtime(slot.dbShowId, cinema.name, slot.label)}
                                disabled={isPast || isUnavailable}
                                title={isPast ? "This show has already started" : slot.statusLabel}
                              >
                                {slot.label}
                                {!isPast && slot.status === "almost-full" && <span className="showtime-status-text">Almost Full</span>}
                              </button>
                              {slot.tag && <span className="showtime-tag-label">{slot.tag}</span>}

                              {hoveredShowId === slot.dbShowId && (() => {
                                const showObj = shows.find(s => s.id === slot.dbShowId);
                                if (!showObj) return null;
                                const booked = showObj.bookedSeats || [];
                                const categories = [
                                  { name: "RECLINER ROWS", price: showObj.price + 450.0, seats: ["A1", "A2", "A3", "A4"] },
                                  { name: "LOUNGER ROWS", price: showObj.price + 50.0, seats: ["B1", "B2", "B3", "B4"] },
                                  { name: "PRIME ROWS", price: showObj.price, seats: ["C1", "C2", "C3", "C4"] },
                                  { name: "CLASSIC ROWS", price: showObj.price, seats: ["D1", "D2", "D3", "D4"] }
                                ];
                                return (
                                  <div className="showtime-tooltip">
                                    {categories.map(cat => {
                                      const availability = getCategoryAvailability(booked, cat.seats);
                                      return (
                                        <div key={cat.name} className="tooltip-cat-col">
                                          <span className="tooltip-price">₹{cat.price.toFixed(2)}</span>
                                          <span className="tooltip-cat-name">{cat.name}</span>
                                          <span className={`tooltip-status ${availability.statusClass}`}>{availability.status}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                );
                              })()}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </main>

        </div>
      ) : (
        /* Screen Mode B: Interactive Seating Map & Checkout */
        <div className="seating-selection-mode animate-fade-in">
          
          {/* Redesigned Seating Header Bar */}
          <div className="seating-header-bar">
            <div className="seating-header-container">
              <button className="btn-header-back" onClick={handleBackToShowtimes} aria-label="Go back">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <div className="header-movie-info">
                <h2 className="header-movie-title">{selectedMovie?.title || "Movie"}</h2>
                <p className="header-movie-subtitle">
                  {selectedCinema}
                  <span className="header-sep">|</span>
                  {selectedDateLabel}, {selectedTimeLabel}
                </p>
              </div>
              <button className="btn-edit-tickets" onClick={handleEditTicketCount}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                {ticketCount} {ticketCount === 1 ? "Ticket" : "Tickets"}
              </button>
            </div>
          </div>

          <main className="booking-page-layout">
            <section className="booking-main-panel">

              {/* Seating Map */}
              <div className="booking-step-section">
                <h2 className="step-title">Select Consecutive Seats</h2>
                
                <div className="theater-map-container">
                  {/* Screen graphic */}
                  <div className="screen-container">
                    <div className="curved-screen"></div>
                    <div className="screen-label">STAGE / SCREEN THIS WAY</div>
                  </div>

                  {/* Seats Legend */}
                  <div className="seats-legend">
                    <div className="legend-item">
                      <div className="legend-box available"></div>
                      <span>Available</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-box selected"></div>
                      <span>Selected ({ticketCount} Seat{ticketCount > 1 ? "s" : ""})</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-box booked"></div>
                      <span>Unavailable</span>
                    </div>
                  </div>

                  {/* Seating Grid */}
                  <div className="visual-seat-grid">
                    {seats.map((seat) => {
                      const isBooked = bookedSeats.includes(seat);
                      const isSelected = selectedSeats.includes(seat);
                      
                      let seatClass = "map-seat";
                      if (isBooked) seatClass += " booked";
                      else if (isSelected) seatClass += " selected";

                      return (
                        <button
                          className={seatClass}
                          key={seat}
                          onClick={() => !isBooked && handleSeatClick(seat)}
                          disabled={isBooked}
                          aria-label={`Seat ${seat}`}
                        >
                          <span className="seat-letter">{seat}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* Receipt Sidebar Checkout */}
            <aside className="booking-receipt-sidebar">
              <div className="receipt-card">
                <div className="receipt-header">
                  <h3>Booking Receipt</h3>
                  <p>CineVerse Cinemas Ltd.</p>
                </div>

                <div className="receipt-poster-row">
                  <img
                    src={selectedMovie?.imageUrl || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba"}
                    alt="Movie poster"
                    className="receipt-poster"
                  />
                  <div className="receipt-movie-info">
                    <h4>{selectedMovie?.title || "Select Movie"}</h4>
                    <p className="receipt-genre">{selectedMovie?.genre || "-"}</p>
                    {selectedMovie?.duration && <p className="receipt-duration">Duration: {selectedMovie.duration}</p>}
                  </div>
                </div>

                <div className="receipt-details">
                  <div className="receipt-row">
                    <span>Cinema</span>
                    <strong className="receipt-cinema-name">{selectedCinema}</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Showtime & Date</span>
                    <strong>{selectedTimeLabel} | {selectedDateLabel}</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Seats Reserved</span>
                    <strong className={selectedSeats.length > 0 ? "highlight-text" : ""}>
                      {selectedSeats.length > 0 ? selectedSeats.join(", ") : "-"}
                    </strong>
                  </div>
                  <div className="receipt-row">
                    <span>Ticket Price</span>
                    <strong>
                      {selectedShow ? `₹${getTicketPriceAmount().toFixed(2)}` : "-"}
                      {selectedSeats.length > 0 && (
                        <span className="receipt-math-breakdown">
                          {" "}({selectedSeats.map(s => `₹${getSeatPrice(s).toFixed(2)}`).join(" + ")})
                        </span>
                      )}
                      {selectedSeats.length === 0 && ticketCount > 1 && selectedShow && (
                        <span className="receipt-math-breakdown">
                          {" "}(₹{selectedShow.price.toFixed(2)} x {ticketCount})
                        </span>
                      )}
                    </strong>
                  </div>
                  <div className="receipt-row">
                    <span>Convenience Fee</span>
                    <strong>
                      {selectedShow ? `₹${(30.00 * ticketCount).toFixed(2)}` : "-"}
                      {ticketCount > 1 && selectedShow && (
                        <span className="receipt-math-breakdown">
                          {" "}(₹30.00 x {ticketCount})
                        </span>
                      )}
                    </strong>
                  </div>
                  
                  <div className="receipt-divider"></div>
                  
                  <div className="receipt-row total-row">
                    <span>Total Payable</span>
                    <strong>{selectedShow ? `₹${(getTicketPriceAmount() + (30.00 * ticketCount)).toFixed(2)}` : "-"}</strong>
                  </div>
                </div>

                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-error">{error}</div>}

                <button
                  className="confirm-booking-btn"
                  onClick={handleConfirmBooking}
                  disabled={selectedSeats.length === 0}
                >
                  Confirm Ticket Reservation
                </button>
              </div>
            </aside>
          </main>
        </div>
      )}

      {/* Payment Simulation Modal */}
      {isPaymentModalOpen && (
        <div className="payment-modal-overlay">
          <div className="payment-modal-card">
            
            {/* Steps: SELECT */}
            {paymentStep === "select" && (
              <div className="payment-step-container">
                <div className="payment-modal-header">
                  <h3>CineVerse Secure Checkout</h3>
                  <button className="payment-modal-close-btn" onClick={() => setIsPaymentModalOpen(false)}>×</button>
                </div>
                
                <div className="payment-summary-box">
                  <div className="summary-title">{selectedMovie?.title}</div>
                  <div className="summary-details">{selectedCinema} | {selectedTimeLabel}</div>
                  <div className="summary-seats">Seats: {selectedSeats.join(", ")}</div>
                  <div className="summary-total-row">
                    <span>Amount Payable:</span>
                    <strong className="text-highlight">₹{(getTicketPriceAmount() + (30.00 * ticketCount)).toFixed(2)}</strong>
                  </div>
                </div>

                <div className="payment-methods-grid">
                  <button 
                    className={`pay-method-btn ${paymentMethod === "upi" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("upi")}
                  >
                    UPI
                  </button>
                  <button 
                    className={`pay-method-btn ${paymentMethod === "card" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("card")}
                  >
                    Card
                  </button>
                  <button 
                    className={`pay-method-btn ${paymentMethod === "netbanking" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("netbanking")}
                  >
                    Net Banking
                  </button>
                </div>

                <div className="payment-details-form">
                  {paymentMethod === "upi" && (
                    <div className="upi-payment-details">
                      <div className="upi-qr-section">
                        <div className="simulated-qr-code">
                          <svg viewBox="0 0 100 100" className="qr-svg">
                            <rect x="10" y="10" width="20" height="20" fill="#333"/>
                            <rect x="70" y="10" width="20" height="20" fill="#333"/>
                            <rect x="10" y="70" width="20" height="20" fill="#333"/>
                            <rect x="15" y="15" width="10" height="10" fill="#fff"/>
                            <rect x="75" y="15" width="10" height="10" fill="#fff"/>
                            <rect x="15" y="75" width="10" height="10" fill="#fff"/>
                            <rect x="35" y="10" width="5" height="15" fill="#333"/>
                            <rect x="45" y="20" width="15" height="5" fill="#333"/>
                            <rect x="35" y="45" width="30" height="15" fill="#333"/>
                            <rect x="10" y="45" width="10" height="10" fill="#333"/>
                            <rect x="45" y="70" width="10" height="20" fill="#333"/>
                            <rect x="70" y="45" width="20" height="15" fill="#333"/>
                          </svg>
                        </div>
                        <p className="qr-instruction">Scan QR Code using any UPI App to pay</p>
                      </div>
                      <div className="upi-input-divider"><span>OR</span></div>
                      <div className="form-group-pay">
                        <label>Enter UPI ID</label>
                        <input type="text" placeholder="username@okhdfcbank" className="pay-input"/>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "card" && (
                    <div className="card-payment-details">
                      <div className="form-group-pay">
                        <label>Card Number</label>
                        <input type="text" placeholder="1234 5678 9101 1121" className="pay-input"/>
                      </div>
                      <div className="card-expiry-row">
                        <div className="form-group-pay">
                          <label>Expiry Date</label>
                          <input type="text" placeholder="MM/YY" className="pay-input"/>
                        </div>
                        <div className="form-group-pay">
                          <label>CVV</label>
                          <input type="password" placeholder="***" className="pay-input"/>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "netbanking" && (
                    <div className="bank-payment-details">
                      <div className="form-group-pay">
                        <label>Select Bank</label>
                        <select className="pay-input select-bank">
                          <option>State Bank of India</option>
                          <option>HDFC Bank</option>
                          <option>ICICI Bank</option>
                          <option>Axis Bank</option>
                          <option>Punjab National Bank</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                <button className="execute-pay-btn" onClick={handleExecutePayment}>
                  Simulate Secure Payment
                </button>
              </div>
            )}

            {/* Steps: PROCESSING */}
            {paymentStep === "processing" && (
              <div className="payment-processing-container">
                <div className="payment-spinner"></div>
                <h4>Processing Secure Payment...</h4>
                <p>Please do not refresh the page or close this window.</p>
              </div>
            )}

            {/* Steps: SUCCESS */}
            {paymentStep === "success" && (
              <div className="payment-status-container success">
                <div className="status-icon success">✓</div>
                <h4>Payment Successful!</h4>
                <p className="status-desc">Your movie tickets have been successfully reserved.</p>
                <div className="success-receipt-box">
                  <div className="receipt-line"><span>Movie:</span> <strong>{selectedMovie?.title}</strong></div>
                  <div className="receipt-line"><span>Cinema:</span> <span>{selectedCinema}</span></div>
                  <div className="receipt-line"><span>Showtime:</span> <strong>{selectedTimeLabel}</strong></div>
                  <div className="receipt-line"><span>Seats:</span> <strong className="text-highlight">{selectedSeats.join(", ")}</strong></div>
                  {message && <div className="ticket-id-notification">{message}</div>}
                </div>
                <button className="btn-close-payment" onClick={handleFinishPayment}>
                  Close & View Dashboard
                </button>
              </div>
            )}

            {/* Steps: FAILURE */}
            {paymentStep === "failure" && (
              <div className="payment-status-container failure">
                <div className="status-icon failure">×</div>
                <h4>Payment/Booking Failed</h4>
                <p className="status-desc text-danger">{error}</p>
                <div className="failure-actions">
                  <button className="btn-retry-payment" onClick={() => setPaymentStep("select")}>
                    Retry Payment
                  </button>
                  <button className="btn-cancel-payment" onClick={() => setIsPaymentModalOpen(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Seat Count Popup Modal */}
      {isSeatCountPopupOpen && (
        <div className="seatcount-popup-overlay" onClick={() => setIsSeatCountPopupOpen(false)}>
          <div className="seatcount-popup-card" onClick={(e) => e.stopPropagation()}>
            <button className="seatcount-popup-close" onClick={() => setIsSeatCountPopupOpen(false)}>×</button>
            
            <div className="seatcount-popup-header">
              <h3>How Many Seats?</h3>
            </div>

            {/* Scooter Illustration */}
            <div className="seatcount-illustration">
              <svg viewBox="0 0 260 120" className="scooter-svg" xmlns="http://www.w3.org/2000/svg">
                {/* Road */}
                <line x1="0" y1="105" x2="260" y2="105" stroke="#333" strokeWidth="2" strokeDasharray="8,6"/>
                {/* Back Wheel */}
                <circle cx="60" cy="95" r="14" fill="none" stroke="#f84464" strokeWidth="2.5">
                  <animateTransform attributeName="transform" type="rotate" from="0 60 95" to="360 60 95" dur="2s" repeatCount="indefinite"/>
                </circle>
                <circle cx="60" cy="95" r="3" fill="#f84464"/>
                {/* Front Wheel */}
                <circle cx="190" cy="95" r="14" fill="none" stroke="#f84464" strokeWidth="2.5">
                  <animateTransform attributeName="transform" type="rotate" from="0 190 95" to="360 190 95" dur="2s" repeatCount="indefinite"/>
                </circle>
                <circle cx="190" cy="95" r="3" fill="#f84464"/>
                {/* Body */}
                <path d="M60 82 Q80 60 120 65 L155 65 Q170 65 180 80 L190 82" fill="none" stroke="#a0aec0" strokeWidth="2.5" strokeLinejoin="round"/>
                {/* Seat */}
                <ellipse cx="100" cy="60" rx="18" ry="5" fill="#f84464" opacity="0.8"/>
                {/* Handlebar */}
                <path d="M178 55 L185 72" stroke="#a0aec0" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M172 50 L185 50" stroke="#a0aec0" strokeWidth="3" strokeLinecap="round"/>
                {/* Headlight */}
                <circle cx="192" cy="73" r="4" fill="#FFD700" opacity="0.9">
                  <animate attributeName="opacity" values="0.9;0.4;0.9" dur="1.5s" repeatCount="indefinite"/>
                </circle>
                {/* Rider stick figure */}
                <circle cx="105" cy="35" r="7" fill="none" stroke="#a0aec0" strokeWidth="2"/>
                <line x1="105" y1="42" x2="105" y2="56" stroke="#a0aec0" strokeWidth="2"/>
                <line x1="105" y1="48" x2="95" y2="55" stroke="#a0aec0" strokeWidth="2"/>
                <line x1="105" y1="48" x2="175" y2="52" stroke="#a0aec0" strokeWidth="1.5"/>
                <line x1="105" y1="56" x2="95" y2="68" stroke="#a0aec0" strokeWidth="2"/>
                <line x1="105" y1="56" x2="115" y2="68" stroke="#a0aec0" strokeWidth="2"/>
                {/* Exhaust puffs */}
                <circle cx="35" cy="88" r="5" fill="#555" opacity="0.3">
                  <animate attributeName="cx" values="35;10" dur="1.5s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.3;0" dur="1.5s" repeatCount="indefinite"/>
                  <animate attributeName="r" values="5;9" dur="1.5s" repeatCount="indefinite"/>
                </circle>
                <circle cx="42" cy="85" r="3" fill="#555" opacity="0.2">
                  <animate attributeName="cx" values="42;18" dur="2s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.2;0" dur="2s" repeatCount="indefinite"/>
                  <animate attributeName="r" values="3;7" dur="2s" repeatCount="indefinite"/>
                </circle>
              </svg>
            </div>

            {/* Seat Count Circles */}
            <div className="seatcount-circles">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  className={`seatcount-circle-btn ${ticketCount === num ? "active" : ""}`}
                  onClick={() => {
                    setTicketCount(num);
                    setSelectedSeats([]);
                  }}
                >
                  {num}
                </button>
              ))}
            </div>

            {/* Category Prices & Availability */}
            {pendingCategories.length > 0 && (
              <div className="seatcount-categories-grid">
                {pendingCategories.map(cat => {
                  const booked = pendingShow?.bookedSeats || [];
                  const availability = getCategoryAvailability(booked, cat.seats);
                  return (
                    <div key={cat.name} className={`seatcount-cat-item ${availability.popupClass}`}>
                      <span className="cat-name">{cat.name}</span>
                      <span className="cat-price">₹{cat.price.toFixed(0)}</span>
                      <span className={`cat-status ${availability.popupClass}`}>{availability.status}</span>
                    </div>
                  );
                })}
              </div>
            )}

            <button 
              className="seatcount-proceed-btn" 
              onClick={handleProceedToSeating}
              disabled={!pendingShowId}
            >
              Select Seats
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Booking;
