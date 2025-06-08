import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { Transaction } from '../transaction-api/transaction.entity';
import configuration from './configuration';

dotenv.config();

const configService = new ConfigService(configuration());
const mongoConfig = configService.get('mongo');

export default new DataSource({
  type: 'mongodb',
  url: mongoConfig.connectionString || 
       `mongodb://${mongoConfig.username}:${mongoConfig.password}@${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.database}?authSource=${mongoConfig.authSource}`,
  database: mongoConfig.database,
  entities: [Transaction],
  migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
  migrationsTableName: 'migrations',
});