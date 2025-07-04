import { MigrationInterface, QueryRunner } from 'typeorm';
import { Transaction, TransactionType } from '../transaction-api/transaction.entity';
import { MongoClient } from 'mongodb';
import configuration from '../config/configuration';
import { ConfigService } from '@nestjs/config';

export class CreateTransactionTable1717690391864 implements MigrationInterface {
  name = 'CreateTransactionTable1717690391864';

  private getMongoUrlAndDbName(): { url: string, dbName: string } {
    let configService = new ConfigService(configuration());
    let mongoConfig = configService.get('mongo');
    let url = mongoConfig.connectionString ||
      `mongodb://${mongoConfig.username}:${mongoConfig.password}@${mongoConfig.host}:${mongoConfig.port}?authSource=${mongoConfig.authSource}`;
    let dbName = mongoConfig.database;
    return { url, dbName };
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    let { url, dbName } = this.getMongoUrlAndDbName();
    let client = await MongoClient.connect(url);
    let db = client.db(dbName);
    await db.createCollection(Transaction.name);
    await db.collection(Transaction.name).createIndex({ id: 1 }, { unique: true });
    await db.collection(Transaction.name).createIndex({ userId: 1 });
    await db.collection(Transaction.name).createIndex({ type: 1 });
    await db.collection(Transaction.name).createIndex({ createdAt: -1 });
    await client.close();
    console.log(`Migration ${this.name} has been applied.`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    let { url, dbName } = this.getMongoUrlAndDbName();
    let client = await MongoClient.connect(url);
    let db = client.db(dbName);
    await db.collection(Transaction.name).drop();
    await client.close();
    console.log(`Migration ${this.name} has been reverted. Collection ${Transaction.name} has been dropped.`);
  }
}
