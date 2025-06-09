#!/bin/sh
echo "Running redis api emulator..."
docker exec -it nestjs-app npx ts-node src/redis/redis-emulator.ts
echo "Redis api emulator started."
