# CineVerse Deployment Guide

This guide outlines the step-by-step procedure to deploy the CineVerse application using **MongoDB Atlas**, **Render** (for PostgreSQL and Spring Boot backends), and **Vercel** (for the React frontend).

---

## 1. Database Provisioning

### A. MongoDB Atlas (for Movie Catalog & Booking Services)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and log in or register.
2. Create a new project named `CineVerse`.
3. Create a free shared cluster (M0 sandbox). Choose your preferred region.
4. Set up database security:
   - Create a database user (e.g., `cineuser`) and generate a secure password. Keep this password safe.
   - Set the IP Access List to allow access from anywhere (`0.0.0.0/0`) since Render web service IPs can change dynamically.
5. In your cluster view, click **Connect** -> **Drivers** -> Copy the connection URI:
   ```text
   mongodb+srv://cineuser:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
   *(Replace `<password>` with your database user's password).*

### B. PostgreSQL Database (for Authentication & Role Management)
You have provisioned your PostgreSQL database on Render. Here are your credentials pre-formatted for Spring Boot deployment:

* **Username**: `cineverse_db_gm6j_user`
* **Password**: `TgnxwbWjHE4X4p8gyXd0uHC5jpwyLov3`
* **Internal JDBC URL** (Recommended for your `auth-service` Web Service on Render):
  ```text
  jdbc:postgresql://dpg-d8ppje8g4nts73874hog-a/cineverse_db_gm6j
  ```
* **External JDBC URL** (For connecting to your Render cloud DB from your local development machine):
  ```text
  jdbc:postgresql://dpg-d8ppje8g4nts73874hog-a.onrender.com/cineverse_db_gm6j
  ```
  *(Note: If connecting externally, check your Render dashboard to verify if the external host uses `.onrender.com` or `<region>.render.com`)*

---

## 2. Deploying Backend Microservices on Render

### A. Auth Service (`auth-service`)
This service handles login, registration, and user accounts.
1. In the Render Dashboard, click **New** -> **Web Service**.
2. Connect your Git repository.
3. Configure the following details:
   - **Name**: `cineverse-auth-service`
   - **Root Directory**: `Backend/auth-service`
   - **Language**: `Docker` or `Java` (Choose **Java** if deploying raw binaries. Render supports Maven builds).
   - If using **Java** runtime:
     - **Build Command**: `chmod +x mvnw && ./mvnw clean package -DskipTests`
     - **Start Command**: `java -jar target/backend-0.0.1-SNAPSHOT.jar`
   - If using **Docker** (requires a Dockerfile):
     - Render will automatically build the service using the Dockerfile in `Backend/auth-service`.
4. Click **Advanced** and add the following **Environment Variables**:
   - `DB_URL`: Your JDBC URL (e.g., `jdbc:postgresql://dpg-d8ppje8g4nts73874hog-a/cineverse_db_gm6j`)
   - `DB_USERNAME`: PostgreSQL username (`cineverse_db_gm6j_user`)
   - `DB_PASSWORD`: PostgreSQL password (`TgnxwbWjHE4X4p8gyXd0uHC5jpwyLov3`)
   - `JWT_SECRET`: A secure 256-bit Hex key (e.g., `9a6747fc6259aa374abfcd182e1858c290a618fce1868a8677c7f3df4ab1e483`)
5. Click **Create Web Service**.

### B. Movie Service (`movie-service`)
This service handles movies, showtimes, seats, and bookings.
1. Click **New** -> **Web Service** on Render.
2. Connect your Git repository.
3. Configure the following details:
   - **Name**: `cineverse-movie-service`
   - **Root Directory**: `Backend/movie-service`
   - If using **Java** runtime:
     - **Build Command**: `chmod +x mvnw && ./mvnw clean package -DskipTests`
     - **Start Command**: `java -jar target/movie-service-0.0.1-SNAPSHOT.jar`
4. Click **Advanced** and add the following **Environment Variables**:
   - `MONGO_URI`: Your MongoDB Atlas connection URI string (e.g., `mongodb+srv://cineuser:<password>@cluster0.xxxx.mongodb.net/cineverse?retryWrites=true&w=majority`)
   - `JWT_SECRET`: *Must be the exact same JWT secret key used in the auth-service.*
5. Click **Create Web Service**.

---

## 3. Deploying the Frontend on Vercel

The frontend is configured to build using Vite and route API requests via Vercel rewrites proxy.

### A. Adjusting Rewrite Destinations (Optional)
If your Render web services have different URLs than the default placeholders in `vercel.json`, update the destination URLs in [vercel.json](file:///c:/Users/Asus/Downloads/CineVerse%20%281%29/CineVerse/Frontend/vercel.json) before deploying:
- `https://cineverse-auth-service.onrender.com` -> Your deployed `auth-service` URL.
- `https://cineverse-movie-service.onrender.com` -> Your deployed `movie-service` URL.

### B. Deploying on Vercel
1. Sign in to [Vercel](https://vercel.com).
2. Click **Add New** -> **Project**.
3. Select your GitHub repository.
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: Select `Frontend` (Vercel will build this folder).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**. Vercel will build and host your frontend, and all `/api/*` requests will be proxied to your Render backend services automatically.
