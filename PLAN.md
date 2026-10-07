## Monolith Summary
The current URL shortener is a Node.js/Express monolith with:
- Single entry point (server.js) starting Express app on configurable port
- REST API with two endpoints: POST /api/url/shorten (create) and GET /api/url/:code (redirect)
- Data storage: MongoDB for persistent URL mappings (originalUrl ↔ shortCode) with auto-increment ID generation via Counter collection
- Caching: Redis cache-aside layer for hot URL lookups to reduce database load
- Business logic: Base62 encoding for short code generation, URL validation, error handling
- Infrastructure: Designed for horizontal scaling with NGINX load balancer and PM2 process manager (per notes)
- Health check: GET /health endpoint
- Stack: Node.js, Express, MongoDB (Mongoose ODM), Redis, Base62 encoding

## Target Microservices Architecture
Following the assignment requirements, I propose decomposing into three services plus an API gateway:

### Services:
1. **URL Service** - Handles URL shortening logic
   - POST /api/urls endpoint
   - URL validation, Base62 encoding, storage
   - Owns URL collection in database

2. **Redirect Service** - Handles URL redirection and analytics notification
   - GET /:shortCode endpoint  
   - Database lookup, HTTP 302 redirect
   - Fire-and-forget notification to Analytics Service

3. **Analytics Service** - Tracks access analytics
   - POST /api/analytics/track endpoint (internal)
   - GET /api/analytics/:shortCode endpoint
   - Owns analytics collection in database

4. **API Gateway** - Single entry point routing requests
   - Routes POST /api/urls → URL Service
   - Routes GET /api/analytics/:shortCode → Analytics Service  
   - Routes GET /:shortCode → Redirect Service

### Shared Infrastructure:
- **Database**: Single MongoDB instance with separate collections (urls, analytics) - acceptable for assignment
- **Communication**: REST over HTTP between services (gateway→services, redirect→analytics)
- **Configuration**: Environment-based configuration per service
- **Containerization**: Docker-compose orchestration

### Proposed Folder Structure:
```
/ (root)
├── /gateway                    # API Gateway service
├── /services
│   ├── /url-service            # URL shortening service
│   ├── /redirect-service       # URL redirection service  
│   └── /analytics-service      # Analytics tracking service
├── /docs                       # Documentation
│   └── architecture.md         # Architecture diagram and description
├── /legacy-monolith            # Original monolith code (moved from root)
├── docker-compose.yml          # Orchestration file
├── .env.example                # Example environment variables
└── README.md                   # Setup and usage instructions
```

Each service will contain:
- package.json with service-specific dependencies
- Entry point (server.js or similar)
- Dockerfile for containerization
- GET /health endpoint
- Environment-based configuration
- No direct imports between services (communicate via HTTP only)

This approach reuses existing logic where possible:
- Base62 encoding utility (shared or copied)
- URL validation logic
- Error handling patterns
- Database connection patterns
- Express.js framework (maintained per service)