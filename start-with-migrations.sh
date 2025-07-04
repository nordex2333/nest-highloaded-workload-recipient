#!/bin/bash
echo "Running migrations..."
export RUN_MIGRATIONS=true
docker exec -it nestjs-app npm run migration:runner
echo "Starting application..."
npm run start:dev
