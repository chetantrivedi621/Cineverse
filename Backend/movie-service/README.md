# CineVerse - Movie Service

The `movie-service` handles all operations related to movie and show listings, metadata, search capability, and catalogs.

## Proposed Tech Stack
- **Spring Boot**: REST APIs and catalog logic
- **MongoDB**: For flexible movie and show document structure (ratings, reviews summary, cast list, formats)
- **Redis**: For caching popular and trending movie listings to reduce query latency

## Key API Endpoints (Planned)
- `GET /api/movies` - Retrieve all movies (supports pagination and filtering)
- `GET /api/movies/{id}` - Retrieve detailed movie metadata
- `POST /api/movies` - Add new movie metadata (ADMIN role)
- `PUT /api/movies/{id}` - Update movie metadata (ADMIN role)
- `DELETE /api/movies/{id}` - Delete movie metadata (ADMIN role)
