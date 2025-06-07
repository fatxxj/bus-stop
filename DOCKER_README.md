# Tugs Project - Docker Setup

This Docker Compose setup runs the entire Tugs project with a single command.

## Services

- **Frontend**: Angular application served by Nginx on port 4200
- **Backend**: .NET 8 Web API on port 5100
- **Database**: Microsoft SQL Server 2022 Express on port 1433

## Quick Start

1. Make sure Docker and Docker Compose are installed
2. Run the entire stack:
   ```
   docker-compose up --build
   ```

3. Access the application:
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:5100
   - SQL Server: localhost:1433

## Database Connection

- **Server**: localhost,1433
- **Username**: sa
- **Password**: YourStrong@Passw0rd
- **Database**: TugsDB (will be created automatically if using Entity Framework)

## Development

To rebuild and restart specific services:

```bash
# Rebuild and restart frontend only
docker-compose up --build frontend

# Rebuild and restart backend only
docker-compose up --build backend

# View logs
docker-compose logs -f [service-name]

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: This will delete database data)
docker-compose down -v
```

## Environment Variables

The SQL Server password can be changed by modifying the `SA_PASSWORD` environment variable in `docker-compose.yml`. Make sure to update the connection string in the backend service as well.

## Notes

- The SQL Server container uses a persistent volume to store data
- The frontend includes a proxy configuration to route API calls to the backend
- All services are connected via a custom Docker network for secure communication
