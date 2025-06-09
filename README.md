# Common Overview

1. **To launch the project:**  
   `docker-compose up --build -d`

2. **Mongo Express (MongoDB UI):**  
   Visit [http://localhost:8081](http://localhost:8081)  
   Basic auth:  
   - Username: `admin`  
   - Password: `pass`

3. **API Documentation:**  
   [http://localhost:3000/api/v1/docs](http://localhost:3000/api/v1/docs)

4. **Seed mock data into DB:**  
   `docker exec -it nestjs-app npx ts-node src/transaction-api/seed.ts`

5. **Enter a container:**  
   `docker exec -it <container_name> sh`

6. **Run tests:**  
   `docker exec -it nestjs-app npm run test`

7. **Database Migrations:**  
   - Generate a new migration: `npm run migration:generate`  
   - Create an empty migration: `npm run migration:create`  
   - Run migrations: `npm run migration:run`  
   - Revert the last migration: `npm run migration:revert`  
   - Show migrations status: `npm run migration:show`  
   - Run migrations using a dedicated script: `npm run migration:runner`  
   - Start the app with migrations: `./start-with-migrations.sh`
   
   **In Docker environment:**
   - Run migrations inside Docker: `docker exec -it nestjs-app npm run migration:run`
   - Run tests in Docker: `docker exec -it nestjs-app npm run test`

7. **Main API endpoints:**  
   [http://localhost:3000/api/v1/](http://localhost:3000/api/v1/)  
   All endpoints are described in the documentation: [http://localhost:3000/api/v1/docs](http://localhost:3000/api/v1/docs)

---

## Redis Integration

- `redis-emulator.ts`: Emulates a remote API, rate-limited, and generates dynamic transaction data for the app to consume via Redis Pub/Sub.
- `redis-poller.service.ts`: Polls the Redis broker for new transaction data and inserts it into the database automatically.
- `start-redis-emulator.sh`: Shell script to launch the Redis emulator inside the Docker container.
- `npm run redis:emulator`: NPM script to launch the Redis emulator (runs in the host shell, not in Docker).

### How to Launch Redis Emulator

After starting all services with:
```sh
   docker-compose up -d
```

**Wait until the NestJS app is fully started and ready (check logs or wait for Swagger docs to be available).**

Then, start the Redis Emulator (inside the app container):
- Using the shell script (recommended):
  ```sh
  sh start-redis-emulator.sh
  ```
- Or using the npm script (host shell, not in Docker):
  ```sh
  npm run redis:emulator
  ```
- Or manually:
  ```sh
  docker exec -it nestjs-app npx ts-node src/redis/redis-emulator.ts
  ```
> **Note:** The emulator must be launched only after the NestJS app is running, otherwise the poller will not be able to fetch data.

The NestJS app will automatically poll the Redis broker and insert new transactions into the database at regular intervals (5 times per minute).

---

## Technologies in Use

1. Docker
2. Node.js v22.15.0 (NestJS framework v11.0.1)
3. MongoDB ^6.16.0
4. Mongo Express v1.0.2 (Mongo web interface)
5. TypeORM for database operations and migrations

---

## Flow to Perform Data Flow and Calculation

**Recommended Flow with Redis Broker (currently emulated by `src/transaction-api/seed.ts`):**

- **External Transaction API:**  
  Emits new transaction events/messages (e.g., via Redis Pub/Sub, RabbitMQ, or Kafka).

- **Your Microservice (Aggregator):**  
  - Subscribes to the Redis channel (or broker topic/queue).
  - Receives new transaction messages in real time (or near real time).
  - Seeds/Inserts each transaction into your MongoDB database as soon as it arrives.

- **API Layer:**  
  - Reads from MongoDB to serve aggregation endpoints (`/aggregation/:userId`, `/aggregation/payouts/all`, etc.).
  - Data is always up to date (delay is only the message propagation and DB write, usually << 2 minutes).

**Benefits:**
- No API rate limit issues: You don’t poll the external API, you just listen for events.
- Real-time or near real-time data: As soon as a transaction happens, it’s in your DB.
- Scalable: You can scale your aggregator horizontally, and Redis Pub/Sub (or a broker) handles the distribution.

---

## Testing Strategy Used

### 1. Unit Tests
- **Services:**
  - Core business logic in `AggregationService` and `PayoutsService` is covered by unit tests.
  - Tests use mocked repositories to simulate database operations, ensuring logic is correct without requiring a real database.
  - Examples:
    - Aggregation of user transactions (earned, spent, payout, paidOut, balance).
    - Aggregation of payouts per user.
- **Test Files:**
  - `aggregation.service.spec.ts`
  - `payouts.service.spec.ts`

### 2. Test Coverage
- Each service method is tested for expected output given mock data.
- Edge cases (e.g., no transactions, multiple payouts) are cered in the tests.

### 3. Test Automation
- Tests are run automatically using Jest via `npm run test`.
- Test configuration ensures only `.spec.ts` files are picked up and run.

---

## TODO Improvements

1. Adjust `docker-compose` file and move logic related to the NestJS container into a dedicated `Dockerfile`.
2. Add CQRS pattern to separate read and write operations in/from the database.
3. Add DTOs (Data Transfer Objects) for request/response validation and typing.
4. Implement Kafka as a message broker for real-time transaction ingestion.
5. ✅ Adjust API versioning to be more flexible and maintainable.
6. ✅ Add database migrations and remove synchronize: true for better schema control.