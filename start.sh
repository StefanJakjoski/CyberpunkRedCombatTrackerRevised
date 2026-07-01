#!/bin/bash

if ! command -v docker &> /dev/null
then
  echo "Docker is not installed."
  echo ""
  echo "Please install Docker Desktop:"
  echo "https://www.docker.com/products/docker-desktop/"
  exit 1
fi

if ! docker compose version &> /dev/null
then
  echo "Docker Compose is not available."
  echo "Please update Docker Desktop."
  exit 1
fi

echo "Starting application..."
sudo docker compose up --build
