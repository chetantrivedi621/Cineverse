import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const seats = ["A1", "A2", "A3", "A4", "B1", "B2", "B3", "B4", "C1", "C2", "C3", "C4", "D1", "D2", "D3", "D4"];

async function getMovies() {
  const response = await api.get("/movies");
  return response.data;
}

async function getTrendingMovies() {
  const response = await api.get("/movies/trending");
  return response.data;
}

async function getMovieById(id) {
  const response = await api.get(`/movies/${id}`);
  return response.data;
}

async function getBookingOptions() {
  const resMovies = await getMovies();
  return {
    movies: resMovies,
    seats
  };
}

export async function getMovieShows(movieId, city, dayOffset) {
  const params = {};
  if (city) params.city = city;
  if (dayOffset !== undefined) params.dayOffset = dayOffset;
  const response = await api.get(`/movies/${movieId}/shows`, { params });
  return response.data;
}

export async function getBookedSeats(showId) {
  const response = await api.get(`/bookings/show/${showId}/seats`);
  return response.data;
}

export async function createBooking(showId, seatNumber) {
  const response = await api.post("/bookings", { showId, seatNumber });
  return response.data;
}

export async function lockSeat(showId, seatNumber) {
  const response = await api.post(`/bookings/show/${showId}/lock`, { showId, seatNumber });
  return response.data;
}

export async function unlockSeat(showId, seatNumber) {
  const response = await api.post(`/bookings/show/${showId}/unlock`, { showId, seatNumber });
  return response.data;
}

export async function getUserBookings() {
  const response = await api.get("/bookings/my-bookings");
  return response.data;
}

export { getBookingOptions, getMovies, getTrendingMovies, getMovieById };

// Authentication APIs
export async function loginUser(email, password) {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
}

export async function registerUser(name, email, password, role, cinemaName, city) {
  const payload = { name, email, password, role };
  if (role === "THEATRE_OWNER") {
    payload.cinemaName = cinemaName;
    payload.city = city;
  }
  const response = await api.post("/auth/register", payload);
  return response.data;
}

export async function logoutUser() {
  const response = await api.get("/auth/logout");
  return response.data;
}

export async function forgotPassword(email) {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
}

export async function resetPassword(email, newPassword) {
  const response = await api.post("/auth/reset-password", { email, newPassword });
  return response.data;
}

// RBAC Testing APIs
export async function testBookTicket() {
  const response = await api.get("/tickets/book");
  return response.data;
}

export async function testManageShows() {
  const response = await api.get("/shows/manage");
  return response.data;
}

export async function testManageUsers() {
  const response = await api.get("/users/manage");
  return response.data;
}

// Add Movie (OWNER / ADMIN)
export async function addMovie(movieData) {
  const response = await api.post("/movies", movieData);
  return response.data;
}

// Update Movie (OWNER / ADMIN)
export async function updateMovie(movieId, movieData) {
  const response = await api.put(`/movies/${movieId}`, movieData);
  return response.data;
}

// Delete Movie (ADMIN)
export async function deleteMovie(movieId) {
  const response = await api.delete(`/movies/${movieId}`);
  return response.data;
}

// Remove all shows for a movie at a specific cinema+city (OWNER)
export async function deleteMovieShowsForCinema(movieId, cinema, city) {
  const response = await api.delete(`/movies/${movieId}/shows/cinema`, {
    params: { cinema, city }
  });
  return response.data;
}

// Add Show (OWNER / ADMIN)
export async function addShow(showData) {
  const response = await api.post("/movies/shows", showData);
  return response.data;
}

// Delete Show (OWNER / ADMIN)
export async function deleteShow(showId) {
  const response = await api.delete(`/movies/shows/${showId}`);
  return response.data;
}

// Get All Bookings (OWNER / ADMIN)
export async function getAllBookings() {
  const response = await api.get("/bookings/all");
  return response.data;
}

// Get All Users (ADMIN)
export async function getAllUsers() {
  const response = await api.get("/auth/users");
  return response.data;
}

// Update User Role (ADMIN)
export async function updateUserRole(userId, role) {
  const response = await api.put(`/auth/users/${userId}/role`, role);
  return response.data;
}

// Delete/Ban User (ADMIN)
export async function deleteUser(userId) {
  const response = await api.delete(`/auth/users/${userId}`);
  return response.data;
}

// Update User Status (ADMIN)
export async function updateUserStatus(userId, status) {
  const response = await api.put(`/auth/users/${userId}/status`, status);
  return response.data;
}

export default api;
