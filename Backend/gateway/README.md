# CineVerse - API Gateway

The API Gateway acts as the single entry point for all frontend requests, routing requests to appropriate backend microservices, executing global authentication checks, and handling rate limiting.

## Proposed Tech Stack
- **Spring Cloud Gateway**: Reactive routing gateway
- **Spring Security**: Centralized JWT signature checks

## Planned Routing Rules
- `/api/auth/**` -> Forward to `auth-service`
- `/api/movies/**` -> Forward to `movie-service`
- `/api/reviews/**` -> Forward to `review-service`
- `/api/tickets/**` -> Forward to `booking-service`
