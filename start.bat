@echo off
echo Starting Tugs Project...
echo.
echo This will build and start:
echo - Frontend (Angular) on http://localhost:4200
echo - Backend (.NET API) on http://localhost:5100
echo - SQL Server on localhost:1433
echo.
echo Building and starting all services...
docker-compose up --build

pause
