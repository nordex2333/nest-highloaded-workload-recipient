# Changelog: redis-broker-addon vs master

## Major Changes

### 1. Database Migrations & Production Safety
- Added TypeORM migration files for MongoDB:
  - `1717690391864-create-transaction-table.ts`: Creates the transaction collection and indexes.
  - `1717690983465-initial-seed-of-transaction-table.ts`: Seeds initial transaction data.
- Removed `synchronize: true` from TypeORM config for production safety.
- Added migration scripts to `package.json` for creating, running, reverting, and showing migrations.
- Added `migration-runner.ts` for programmatic migration execution.
- Updated `start-with-migrations.sh` for running app with migrations.
- Updated `README.md` with migration instructions.

### 2. Transaction Type Enum & Swagger
- Introduced `TransactionType` enum in `transaction.entity.ts` for type safety and Swagger documentation.
- Updated all usages of transaction type strings to use the enum.
- Updated Swagger docs to reflect enum values.

### 3. Configuration Improvements
- Centralized MongoDB connection config in `configuration.ts` and `typeorm.config.ts`.
- All migrations now use `ConfigService` and `configuration.ts` for DB connection info.

### 4. Code & Service Updates
- Updated `AggregationService` and `PayoutsService` to use the new enum and improved logic.
- Updated seeding logic in `seed.ts` to use the enum and new config.

### 5. File & Naming Cleanups
- Renamed migration files for clarity and consistency.
- Removed obsolete migration files and scripts.

## 6: Aggregation Refactor & Type Consistency
- Removed `PAID_OUT`/`paidOut` from the `TransactionType` enum, aggregation logic, and all DTOs to match the actual DB schema.
- Refactored `AggregationService.aggregateDataByUserId` to return `{ userId, balance, totals }` where `totals` is a `Record<TransactionType, number>`.
- Updated all usages and tests to expect the new `totals` structure instead of separate `earned`, `spent`, `payout`, `paidOut` fields.
- Fixed TypeScript errors related to missing or mismatched properties in aggregation results.
- Ensured all code, DTOs, and documentation are consistent and type-safe with the new structure.

## 7: Redis Integration & Emulator Launch
- Added `start-redis-emulator.sh` shell script to easily launch the Redis emulator inside the Docker container.
- Added `npm run redis:emulator` script to launch the Redis emulator from the host shell.
- Updated README: clarified that only `docker-compose up -d` is needed to start all services, and the emulator should be launched only after the NestJS app is ready.
- Documented all Redis-related launch options and emphasized the correct launch order for the emulator and poller.
- Standardized all code and documentation to use the term "Redis broker" where appropriate.
- Ensured the `Transaction` entity uses the lowercase `transaction` collection for consistency in MongoDB.
- All Redis configuration (host, port, rate limit) is now environment-driven and type-safe.

## 8: Pagination Meta for Aggregation & Payout Controllers
- Added pagination metadata (`meta` object) to the responses of aggregation and payout controllers, matching the structure of the transaction controller.
- The `meta` object includes: current page, total items, items per page, and total pages, making API responses more consistent and client-friendly.

## Minor/Other Changes
- Updated `.env` and Docker-related instructions in `README.md`.
- Improved error handling and logging in migration scripts.
- Added TODOs and improvement notes in `README.md`.

---

**This changelog summarizes all major and minor changes introduced in the `redis-broker-addon` branch compared to `master`, focusing on database migration support, configuration, and codebase modernization for production readiness.**
