import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  process.env.RUN_MIGRATIONS = 'true';
  
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('MigrationRunner');
  
  logger.log('Application initialized with migrations enabled');
  logger.log('Migrations have been run successfully');
  
  await app.close();
  process.exit(0);
}

bootstrap()
  .catch((error) => {
    const logger = new Logger('MigrationRunner');
    logger.error('Failed to run migrations', error);
    process.exit(1);
  });
