import { MigrationInterface, QueryRunner } from 'typeorm';
import { Transaction, TransactionType } from '../transaction-api/transaction.entity';
import { MongoClient } from 'mongodb';
import configuration from '../config/configuration';
import { ConfigService } from '@nestjs/config';

export class InitialSeedOfTransactionTable1717690983465 implements MigrationInterface {
  name = 'InitialSeedOfTransactionTable1717690983465';

  private getMongoUrlAndDbName(): { url: string, dbName: string } {
    let configService = new ConfigService(configuration());
    let mongoConfig = configService.get('mongo');
    let url = mongoConfig.connectionString ||
      `mongodb://${mongoConfig.username}:${mongoConfig.password}@${mongoConfig.host}:${mongoConfig.port}?authSource=${mongoConfig.authSource}`;
    let dbName = mongoConfig.database;
    return { url, dbName };
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    let transactions = [
      {
        id: '41bbdf81-735c-4aea-beb3-3e5f433a30c5',
        userId: '074092',
        createdAt: new Date('2023-03-16T12:33:11.000Z'),
        type: TransactionType.PAYOUT,
        amount: 30,
      },
      {
        id: '41bbdf81-735c-4aea-beb3-3e5fasfsdfef',
        userId: '074092',
        createdAt: new Date('2024-03-12T12:33:11.000Z'),
        type: TransactionType.SPENT,
        amount: 12,
      },
      {
        id: '41bbdf81-735c-4aea-beb3-342jhj234nj234',
        userId: '074092',
        createdAt: new Date('2024-04-15T12:33:11.000Z'),
        type: TransactionType.EARNED,
        amount: 1.2,
      },
      {
        id: '51bbdf81-735c-4aea-beb3-3e5f433a30c6',
        userId: '123456',
        createdAt: new Date('2024-05-18T10:00:00.000Z'),
        type: TransactionType.EARNED,
        amount: 50,
      },
      {
        id: '61bbdf81-735c-4aea-beb3-3e5f433a30c7',
        userId: '123456',
        createdAt: new Date('2024-06-19T11:00:00.000Z'),
        type: TransactionType.SPENT,
        amount: 20,
      }
    ]; 
    let { url, dbName } = this.getMongoUrlAndDbName();
    let client = await MongoClient.connect(url);
    let db = client.db(dbName);
    
    await db.collection(Transaction.name).insertMany(transactions);
    
    await client.close();

    console.log(`Migration ${this.name} has seeded sample data.`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    let ids = [
      '41bbdf81-735c-4aea-beb3-3e5f433a30c5',
      '41bbdf81-735c-4aea-beb3-3e5fasfsdfef',
      '41bbdf81-735c-4aea-beb3-342jhj234nj234',
      '51bbdf81-735c-4aea-beb3-3e5f433a30c6',
      '61bbdf81-735c-4aea-beb3-3e5f433a30c7'
    ];
    let { url, dbName } = this.getMongoUrlAndDbName();
    let client = await MongoClient.connect(url);
    let db = client.db(dbName);
    
    await db.collection(Transaction.name).deleteMany({ id: { $in: ids } });
    
    await client.close();
    
    console.log(`Migration ${this.name} has been reverted.`);
  }
}
