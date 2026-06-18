# CineVerse - Review Service

The `review-service` manages user ratings, text reviews, and feedback on movies and shows.

## Proposed Tech Stack
- **Spring Boot**: REST APIs and review business logic
- **PostgreSQL**: For relational, structured reviews data ensuring strong consistency and foreign key constraints linking Users and Movies
- **RabbitMQ**: For publishing review events (e.g. updating a movie's average rating in the movie-service asynchronously)

## Key API Endpoints (Planned)
- `GET /api/reviews/movie/{movieId}` - Get all reviews for a specific movie
- `POST /api/reviews` - Post a new review (USER role required)
- `PUT /api/reviews/{id}` - Edit a review (Author required)
- `DELETE /api/reviews/{id}` - Delete a review (Author or ADMIN required)
