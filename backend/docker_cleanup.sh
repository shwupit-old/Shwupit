#!/bin/bash

# Stop all running containers
echo "Stopping all Docker containers..."
docker stop $(docker ps -aq)

# Remove all containers
echo "Removing all Docker containers..."
docker rm $(docker ps -aq)

# Remove all Docker volumes
echo "Removing all Docker volumes..."
docker volume rm $(docker volume ls -q)

# Remove all Docker images
echo "Removing all Docker images..."
docker rmi $(docker images -q)

echo "Docker cleanup completed."

