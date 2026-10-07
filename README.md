# URL Shortener Microservices

A microservices-based URL shortener application built with Node.js, Express, and MongoDB. This implementation demonstrates how to decompose a monolithic URL shortener into independent, scalable services.

## Features

- **URL Shortening**: Convert long URLs to short, shareable links
- **URL Redirection**: Redirect users from short codes to original URLs
- **Analytics Tracking**: Monitor access counts and timestamps for each short URL
- **Microservices Architecture**: Independently deployable services
- **API Gateway**: Single entry point for all client requests
- **Docker Support**: Easy deployment with Docker Compose
- **Health Checks**: Each service includes a `/health` endpoint
- **Environment Configuration**: Configurable via environment variables

## Architecture

The system consists of four services:
1. **API Gateway** (Port 8080) - Routes requests to appropriate services
2. **URL Service** (Port 3001) - Handles URL shortening logic
3. **Redirect Service** (Port 3002) - Handles URL redirection and analytics notification
4. **Analytics Service** (Port 3003) - Tracks access analytics

See [docs/architecture.md](./docs/architecture.md) for detailed architecture diagram and explanation.

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js (for local development without Docker)

### Using Docker Compose (Recommended)

1. Clone the repository
2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
3. Start all services:
   ```bash
   docker compose up --build
   ```
4. The API Gateway will be available at http://localhost:8080

### Local Development (Without Docker)

1. Install MongoDB locally or update the MONGO_URI in .env files
2. Install dependencies for each service:
   ```bash
   # URL Service
   cd services/url-service && npm install
   
   # Redirect Service
   cd services/redirect-service && npm install
   
   # Analytics Service
   cd services/analytics-service && npm install
   
   # API Gateway
   cd gateway && npm install
   ```
3. Start MongoDB
4. Start each service in separate terminals:
   ```bash
   # Terminal 1: URL Service
   cd services/url-service && npm start
   
   # Terminal 2: Redirect Service
   cd services/redirect-service && npm start
   
   # Terminal 3: Analytics Service
   cd services/analytics-service && npm start
   
   # Terminal 4: API Gateway
   cd gateway && npm start
   ```

## API Endpoints

### URL Shortening
**Create a short URL**
```
POST http://localhost:8080/api/urls
Content-Type: application/json

{
  "url": "https://example.com/very/long/url/that/needs/to/be/shortened"
}

Response (201 Created):
{
  "shortCode": "abc123",
  "shortUrl": "http://localhost:8080/abc123",
  "url": "https://example.com/very/long/url/that/needs/to/be/shortened"
}
```

### URL Redirection
**Redirect to original URL**
```
GET http://localhost:8080/abc123

Response: HTTP 302 Redirect to original URL
```

### Analytics
**Track an access** (called internally by Redirect Service)
```
POST http://localhost:8080/api/analytics/track
Content-Type: application/json

{
  "shortCode": "abc123"
}

Response (200 OK):
{
  "message": "Access tracked successfully"
}
```

**Get analytics for a short code**
```
GET http://localhost:8080/api/analytics/abc123

Response (200 OK):
{
  "shortCode": "abc123",
  "requestCount": 5,
  "lastAccessed": "2026-10-07T10:30:00.000Z",
  "accessLog": [
    "2026-10-07T10:30:00.000Z",
    "2026-10-07T10:25:00.000Z",
    "2026-10-07T10:20:00.000Z",
    "2026-10-07T10:15:00.000Z",
    "2026-10-07T10:10:00.000Z"
  ]
}
```

Response (404 Not Found):
{
  "error": "Analytics data not found"
}
```

### Health Checks
Each service exposes a `/health` endpoint:
- Gateway: `http://localhost:8080/health`
- URL Service: `http://localhost:3001/health`
- Redirect Service: `http://localhost:3002/health`
- Analytics Service: `http://localhost:3003/health`

## Project Structure

```
urlshortner/
├── gateway/                    # API Gateway service
├── services/                   # All microservices
│   ├── url-service/           # URL shortening service
│   ├── redirect-service/      # URL redirection service
│   └── analytics-service/     # Analytics tracking service
├── docs/                      # Documentation
│   └── architecture.md        # Architecture diagram and description
├── legacy-monolith/           # Original monolith code (for reference)
├── docker-compose.yml         # Docker Compose orchestration
├── .env.example               # Example environment variables
└── README.md                  # This file
```

## Environment Variables

Each service can be configured using environment variables. See `.env.example` files in each service directory for specific variables.

Common variables:
- `PORT`: Port on which the service runs
- `MONGO_URI`: MongoDB connection string
- Service URL variables (for inter-service communication in gateway)

## Design Decisions

1. **Database-per-Service vs Shared Database**: For simplicity in this assignment, all services share a single MongoDB instance with separate collections. In production, consider database-per-service for loose coupling.

2. **Inter-Service Communication**: Services communicate via synchronous HTTP (gateway to services) and asynchronous fire-and-forget (redirect to analytics).

3. **Error Handling**: Analytics service failures do not impact redirect performance (fire-and-forget with timeout).

4. **Short Code Generation**: URL Service generates Base62 encoded short codes with collision detection and retry logic.

5. **Health Checks**: Each service includes a `/health` endpoint for monitoring and orchestration.

## Testing the Implementation

After starting all services with `docker compose up --build`:

1. **Create a short URL**:
   ```bash
   curl -X POST http://localhost:8080/api/urls \
     -H "Content-Type: application/json" \
     -d '{"url": "https://example.com"}'
   ```
   Response: `{"shortCode":"abc123","shortUrl":"http://localhost:8080/abc123","url":"https://example.com"}`

2. **Test redirection**:
   Replace `abc123` with the `shortCode` returned in step 1.
   ```bash
   curl -I http://localhost:8080/abc123
   ```
   Should return HTTP 302 with Location header pointing to https://example.com

3. **Check analytics**:
   Use the same `shortCode` returned in step 1.
   ```bash
   curl http://localhost:8080/api/analytics/abc123
   ```
   Should show access count and timestamps

4. **Verify health checks**:
   ```bash
   curl http://localhost:8080/health
   curl http://localhost:3001/health
   curl http://localhost:3002/health
   curl http://localhost:3003/health
   ```

## Moving Forward

To extend this implementation:
- Add authentication and rate limiting
- Implement custom alias support
- Add URL expiration features
- Improve analytics with geographic data and user agents
- Add circuit breaker pattern for inter-service communication
- Implement database-per-service pattern
- Add caching layer (Redis) for hot URLs
- Implement distributed tracing