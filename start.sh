#!/usr/bin/env bash

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

logfile=0
nologs=0

while [[ $# -gt 0 ]]; do
  arg=$1
  [[ $arg == "-l" || $arg == "--logfile" ]] && logfile=1
  [[ $arg == "-n" || $arg == "--nologs" ]] && nologs=1
  shift
done

[[ $logfile -eq 1 ]] && exec>>tracker.log
[[ $nologs -eq 1 ]] && exec>/dev/null

echo "Starting application..."
sudo docker compose up --build

