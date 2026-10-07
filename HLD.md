# High-Level Design (HLD) - URL Shortener Service

## 1. Executive Summary
This document describes the high-level architecture of a URL shortener service built with Node.js, Express, MongoDB, and Redis. The service provides shortened URLs that redirect to original long URLs, with caching for improved performance and horizontal scalability through load balancing.

## 2. System Overview
The URL shortener service is designed to:
- Accept long URLs and generate unique short codes
- Redirect users from short codes to original URLs
- Handle high traffic volumes through caching and load balancing
- Provide health check endpoints for monitoring
- Scale horizontally using multiple application instances

## 3. Architectural Style
The system follows a **Layered (N-tier) architecture** with clear separation of concerns:
- Presentation Layer (HTTP API)
- Business Logic Layer (Service)
- Data Access Layer (Repository)
- Data Layer (MongoDB + Redis)

## 4. Key Components

### 4.1 Application Server (Node.js/Express)
- **Technology**: Node.js with Express framework
- **Responsibilities**:
  - HTTP request handling
  - API endpoint routing
  - Middleware for JSON parsing and error handling
  - Integration with business logic services

### 4.2 API Endpoints
- `POST /api/url/shorten` - Create a shortened URL
  - Input: `{ "originalUrl": "https://example.com/very/long/url" }`
  - Output: `{ "shortuRL": "http://localhost:8181/api/url/abc123" }`
- `GET /api/url/:code` - Redirect to original URL
  - Input: Short code parameter (e.g., `abc123`)
  - Output: HTTP 302 redirect to original URL
- `GET /health` - Health check endpoint
  - Output: Service status information

### 4.3 Service Layer
- **Technology**: Plain JavaScript modules
- **Responsibilities**:
  - Business logic for URL shortening and redirection
  - Cache-aside pattern implementation with Redis
  - Coordination between repository and external systems
  - Short code generation using Base62 encoding

### 4.4 Data Access Layer (Repository)
- **Technology**: Mongoose ODM for MongoDB
- **Responsibilities**:
  - CRUD operations on URL mappings
  - Auto-increment ID generation using separate counter collection
  - Database query execution

### 4.5 Data Storage
- **Primary Store**: MongoDB
  - Stores permanent URL mappings (original URL ↔ short code)
  - Schema includes: _id (numeric), originalUrl, shortCode, createdAt, clickCount
- **Cache Store**: Redis
  - Implements cache-aside pattern for hot URL lookups
  - Stores short code → original URL mappings
  - Reduces database load for frequently accessed URLs

### 4.6 Infrastructure Components
- **Load Balancer/Reverse Proxy**: NGINX
  - Distributes traffic across multiple application instances
  - Provides single entry point (port 8080)
  - Configured for horizontal scaling
- **Process Manager**: PM2
  - Manages Node.js application processes
  - Enables clustering for multi-core utilization
  - Provides automatic restart and monitoring
- **Containerization**: Docker (referenced in notes)
  - Used for consistent deployment environments
  - NGINX runs in Docker container

## 5. Data Flow

### 5.1 URL Shortening Flow
1. Client sends POST request to `/api/url/shorten` with original URL
2. Express router directs request to controller
3. Controller validates input and calls service layer
4. Service layer:
   - Calls repository to store URL mapping and get numeric ID
   - Encodes numeric ID to Base62 short code
   - Updates database with short code
   - Returns shortened URL to client
5. Repository:
   - Generates auto-increment ID using counter collection
   - Creates URL document in MongoDB
   - Updates document with short code

### 5.2 URL Redirection Flow
1. Client requests `/api/url/:code` (short code)
2. Express router directs request to controller
3. Controller calls service layer
4. Service layer implements cache-aside pattern:
   - Checks Redis for cached original URL (HOT path)
   - If cache miss, queries MongoDB for URL mapping (COLD path)
   - Caches result in Redis for future requests
   - Returns original URL
5. Controller performs HTTP redirect to original URL

## 6. Scalability Features

### 6.1 Horizontal Scaling
- Multiple application instances behind NGINX load balancer
- Shared MongoDB and Redis instances for data consistency
- Stateless application design enables easy scaling

### 6.2 Caching Strategy
- Cache-aside pattern with Redis
- Hot URLs served from Redis (sub-millisecond response)
- Cold URLs fetched from MongoDB and cached
- Reduces database load significantly for popular URLs

### 6.3 Database Optimization
- Auto-increment numeric IDs for efficient indexing
- Base62 encoding produces short, readable codes
- Separate counter collection prevents ID collisions
- Indexes on shortCode field for fast lookups

## 7. Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Runtime | Node.js v18+ | JavaScript runtime |
| Framework | Express v5 | Web application framework |
| Database | MongoDB v6 | Primary data storage |
| Cache | Redis v6 | In-memory caching |
| ODM | Mongoose v9 | MongoDB object modeling |
| Encoding | Base62 | Short code generation |
| Process Manager | PM2 | Application clustering and management |
| Load Balancer | NGINX | Traffic distribution and reverse proxy |
| Containerization | Docker | Environment consistency (per notes) |
| Monitoring | Apache Bench (ab) | Performance testing (per notes) |

## 8. Security Considerations
- Input validation for original URLs
- Error handling prevents information leakage
- Redis and MongoDB should be secured in production
- Rate limiting could be implemented to prevent abuse
- HTTPS termination at NGINX level (recommended for production)

## 9. Deployment Architecture (Per Notes)
```
[Client] 
     ↓ (HTTP)
[NGINX:8080] ← Load Balancer
     ↓ (HTTP)
[PM2 Cluster] 
   ├─ [Node.js:8081] ← Application Instance 1
   ├─ [Node.js:8082] ← Application Instance 2
   ├─ [Node.js:8083] ← Application Instance 3
   ├─ [Node.js:8084] ← Application Instance 4
   └─ [Node.js:8085] ← Application Instance 5
     ↓ (MongoDB/Redis)
[MongoDB] ← Primary Storage
     ↓ (Redis)
[Redis] ← Cache Layer
```

## 10. Performance Characteristics
- **URL Shortening**: O(1) database write + O(log n) index update
- **URL Redirection**: O(1) cache lookup (hot path) or O(log n) database query (cold path)
- **Base62 Encoding**: O(log₆₂ n) where n is the numeric ID
- **Horizontal Scaling**: Linear throughput increase with additional instances

## 11. Future Enhancements
- Analytics tracking (click counts, geographic data)
- Custom alias support
- URL expiration features
- API rate limiting and authentication
- Docker Compose/Kubernetes deployment scripts
- Comprehensive test suite
- CI/CD pipeline integration
- Advanced caching strategies (LRU, TTL)
- Database sharding for extreme scale

## 12. Conclusion
This URL shortener service provides a scalable, performant foundation for URL shortening functionality. The layered architecture separates concerns effectively, while the caching strategy and load balancing enable horizontal scaling to meet varying traffic demands. The technology choices are well-suited for the problem domain, with proven technologies handling each aspect of the system.