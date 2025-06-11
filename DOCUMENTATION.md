# Project Documentation

## Architecture Overview

The project follows a modern web application architecture with:
- Frontend: Angular (TypeScript)
- Backend: ASP.NET Core (C#)
- Database: SQL Server
- Authentication: JWT (JSON Web Tokens)

## Security Implementation

### Authentication System

1. **JWT-based Authentication**
   - Uses JSON Web Tokens for secure authentication
   - Token configuration:
     - Valid for 7 days
     - Uses HMAC-SHA256 signing algorithm
     - Includes user claims (ID, email, first name, last name)

2. **Password Security**
   - Passwords are hashed using ASP.NET Core Identity's secure hashing
   - Password validation rules are enforced through Identity framework
   - No plain text passwords are stored

3. **Token Management**
   - Tokens are stored in localStorage on the frontend
   - Automatic token expiration checking
   - Automatic logout on token expiration
   - Token refresh mechanism implemented

### Authorization

1. **Role-based Access Control**
   - Uses ASP.NET Core Identity for role management
   - Protected routes require authentication
   - API endpoints are secured with `[Authorize]` attribute

2. **Route Protection**
   - Frontend routes are protected using `AuthGuard`
   - Unauthorized users are redirected to login page
   - API endpoints are protected with authorization middleware

### User Management

1. **Admin Account**
   - A default admin account is created during database seeding
   - Admin credentials:
     - Email: tester@filippo.com
     - Password: FilippoTUG1!
   - Admin role provides full access to all features
   - This account should be used for initial setup and management

2. **User Registration**
   - New users can register through the registration form
   - Registration requires:
     - Valid email address
     - Password meeting security requirements
     - First and last name
   - New users are assigned the default "User" role

3. **User Roles**
   - Admin: Full access to all features
   - User: Standard access to basic features
   - Role-based permissions are enforced throughout the application

## Frontend Architecture

### Core Components

1. **Authentication Service**
   - Handles user authentication state
   - Manages JWT tokens
   - Provides user information
   - Implements login/logout functionality

2. **HTTP Interceptors**
   - Automatically adds JWT tokens to requests
   - Handles 401 unauthorized responses
   - Manages authentication errors

3. **Guards**
   - `AuthGuard` protects routes requiring authentication
   - Redirects unauthorized users to login

### State Management
- Uses Angular's built-in state management
- User state managed through BehaviorSubject
- Persistent storage using localStorage

## Backend Architecture

### Core Components

1. **Controllers**
   - `AuthController`: Handles authentication operations
   - `JourneysController`: Manages journey-related operations
   - RESTful API endpoints with proper HTTP methods

2. **Services**
   - `JourneyService`: Business logic for journey operations
   - `StopService`: Business logic for stop operations
   - Dependency injection for loose coupling

3. **Data Access**
   - Entity Framework Core for database operations
   - Repository pattern implementation
   - SQL Server database

## Security Best Practices

1. **API Security**
   - CORS policy configured for frontend access
   - HTTPS enforced in production
   - Input validation on all endpoints
   - Proper error handling

2. **Data Protection**
   - Sensitive data encrypted
   - SQL injection prevention through Entity Framework
   - XSS protection through Angular's built-in security

3. **Session Management**
   - Secure token storage
   - Automatic session expiration
   - Proper logout handling

### API Endpoints

1. **Authentication Endpoints**
   - POST `/api/auth/register`: User registration
   - POST `/api/auth/login`: User login
   - POST `/api/auth/logout`: User logout
   - PUT `/api/auth/update`: Update user profile

2. **Journey Endpoints**
   - GET `/api/journeys`: Get all journeys (paginated)
   - GET `/api/journeys/{id}`: Get specific journey
   - POST `/api/journeys`: Create new journey
   - PUT `/api/journeys/{id}`: Update journey
   - DELETE `/api/journeys/{id}`: Delete journey

## Geocoding Functionality

### Stop Location Management

1. **Geocoding Service**
   - Integration with OpenStreetMap Nominatim API
   - Provides bidirectional geocoding:
     - Forward geocoding: Convert city names to coordinates
     - Reverse geocoding: Convert coordinates to city names

2. **Stop Creation Process**
   - When creating a stop, users can:
     - Enter a city name to automatically fetch coordinates
     - Enter coordinates to automatically fetch the city name
   - The system automatically validates and formats the location data
   - Coordinates are stored in the database in decimal degrees format

3. **Implementation Details**
   - Frontend service: `GeocodingService`
   - Handles API calls to Nominatim
   - Implements rate limiting to comply with API usage policies
   - Caches results to minimize API calls
   - Error handling for invalid locations or API failures

4. **Usage Example**
   ```typescript
   // Frontend implementation
   const geocodingService = new GeocodingService();

   // Forward geocoding (city name to coordinates)
   const coordinates = await geocodingService.getCoordinates('London, UK');
   // Returns: { lat: 51.5074, lon: -0.1278 }

   // Reverse geocoding (coordinates to city name)
   const location = await geocodingService.getLocation(51.5074, -0.1278);
   // Returns: "London, Greater London, England, United Kingdom"
   ```
## Distance Calculation

### Journey Distance Management

1. **Distance Calculation Service**
   - Integration with OpenStreetMap OSRM API
   - Calculates actual driving distances between stops
   - Provides accurate route-based distances
   - Handles multiple stops in sequence

2. **Distance Calculation Process**
   - When creating a journey:
     - System automatically calculates distances between consecutive stops
     - Uses the actual road network for accurate measurements
     - Returns distances in kilometers
     - Handles international routes and different countries

3. **Implementation Details**
   - Frontend service: `DistanceCalculationService`
   - Makes API calls to OSRM for each segment
   - Implements error handling for:
     - Invalid coordinates
     - Unreachable locations
     - API failures
   - Caches results to optimize performance

4. **Usage Example**
   ```typescript
   // Frontend implementation
   const distanceService = new DistanceCalculationService();

   // Calculate distance between two stops
   const distance = await distanceService.calculateDistance(
   { lat: 51.5074, lon: -0.1278 }, // London
   { lat: 48.8566, lon: 2.3522 }   // Paris
   );
   // Returns: 343.5 (kilometers)

   // Calculate total journey distance
   const totalDistance = await distanceService.calculateTotalDistance([
   { lat: 51.5074, lon: -0.1278 }, // London
   { lat: 48.8566, lon: 2.3522 },  // Paris
   { lat: 41.9028, lon: 12.4964 }  // Rome
   ]);
   // Returns: 1432.8 (kilometers)
   ```


## Development Setup

1. **Environment Configuration**
   - Development and production environments
   - Environment-specific settings
   - Secure configuration management

2. **Docker Support**
   - Containerized application
   - Docker Compose for local development
   - Production-ready Docker configuration

## Deployment

1. **Docker Deployment**
   - Multi-stage builds
   - Optimized container images
   - Environment variable configuration

2. **Database Migration**
   - Automatic migration on startup
   - Version control for database schema
   - Data seeding support

## Recommendations for Security Enhancement

1. **Additional Security Measures**
   - Implement rate limiting
   - Add request validation middleware
   - Enable HTTPS in development
   - Implement refresh token mechanism

2. **Monitoring and Logging**
   - Add structured logging
   - Implement audit trails
   - Add security event monitoring

3. **Performance Optimization**
   - Implement caching strategy
   - Add response compression
   - Optimize database queries


## Environment Configuration

### Frontend Environment
```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5100/api'
};
```

### Backend Configuration
```json
{
  "JWT": {
    "ValidAudience": "http://localhost:4200",
    "ValidIssuer": "http://localhost:5100",
    "Secret": "JWTAuthenticationSecretKey123456789",
    "ExpirationInDays": 7
  }
}
```