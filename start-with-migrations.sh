#!/bin/bash
echo "Running migrations..."
export RUN_MIGRATIONS=true
npm run migration:runner
echo "Starting application..."
npm run start:dev
