# 🎬 CineVerse

CineVerse is a full-stack movie discovery and booking platform inspired by Netflix and BookMyShow. It features a modern React frontend and a microservices-based backend using Spring Boot.

## 🚀 Features

- User Authentication & Role-Based Access Control (RBAC)
- Movie Catalog & Discovery
- Theatre Owner Dashboard
- Admin Management Portal
- Seat Booking & Interactive Seat Map
- Protected Routes & JWT-based Authentication
- Responsive UI Design
- Automated CI/CD Pipeline (GitHub Actions)

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js (Vite)
- **Routing:** React Router DOM
- **Styling:** CSS3
- **HTTP Client:** Axios
- **Deployment:** Vercel / Netlify

### Backend
- **Framework:** Spring Boot (Java 21)
- **Architecture:** Microservices
  - **Auth Service:** Handles user registration, login, JWT validation, and user management.
  - **Movie Service:** Handles movie catalog, shows, and booking management.
- **Databases:** 
  - PostgreSQL (Auth Service)
  - MongoDB (Movie Service)
- **Deployment:** Render / Docker

## 📂 Project Structure

```bash
CineVerse/
├── Frontend/           # React SPA
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Route pages (Login, Dashboard, Booking, etc.)
│   │   ├── services/   # API Integration (Axios)
│   │   └── utils/      # Helpers
│   └── public/         # Static assets & Netlify redirects
├── Backend/
│   ├── auth-service/   # Spring Boot Auth Microservice (PostgreSQL)
│   └── movie-service/  # Spring Boot Movie Microservice (MongoDB)
├── .github/workflows/  # CI/CD GitHub Actions Pipeline
└── docs/               # System Architecture Documentation
```

## ⚙️ CI/CD Pipeline

This project includes a fully automated CI/CD pipeline using **GitHub Actions**. Upon every push or pull request to the `main` branch, the pipeline will:
1. Build the React Frontend using `npm`.
2. Build the Spring Boot Auth Service using `maven`.
3. Build the Spring Boot Movie Service using `maven`.

## 🚀 Deployment Instructions

### Frontend (Vercel or Netlify)
The frontend is pre-configured for both Vercel (`vercel.json`) and Netlify (`public/_redirects`). 
1. Import the repository into your preferred platform.
2. Set the Root Directory to `Frontend`.
3. Once the backend is deployed, update the placeholder URLs in `vercel.json` or `_redirects` to point to your live backend URLs.

### Backend (Render)
Both microservices include a `Dockerfile` for seamless deployment.
1. Connect your repository to Render as a Web Service.
2. Select the `Docker` environment.
3. Configure the following environment variables:
   - **Auth Service:** `DB_URL` (Postgres URL), `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`.
   - **Movie Service:** `MONGO_URI` (MongoDB URL), `JWT_SECRET`.
