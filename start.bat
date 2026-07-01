@echo off

docker --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Docker is not installed.
    echo Please install Docker Desktop:
    echo https://www.docker.com/products/docker-desktop/
    pause
    exit /b
)

docker compose version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Docker Compose is not available.
    echo Please update Docker Desktop.
    pause
    exit /b
)

echo Starting application...
docker compose up --build
pause
