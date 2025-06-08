import { DataSource } from 'typeorm';
import { Transaction, TransactionType } from './transaction.entity';

let AppDataSource = new DataSource({
  type: 'mongodb',
  url: 'mongodb://root:example@mongo:27017/nest_test?authSource=admin',
  database: 'nest_test',
  entities: [Transaction],
  synchronize: false,
});

async function seed() {
  await AppDataSource.initialize();
  let repo = AppDataSource.getMongoRepository(Transaction);

  await repo.deleteMany({});

  await repo.insertMany([
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
    },
    {
      id: '71bbdf81-735c-4aea-beb3-3e5f433a30c8',
      userId: '123456',
      createdAt: new Date('2024-07-20T12:00:00.000Z'),
      type: TransactionType.PAYOUT,
      amount: 10,
    },
    {
      id: 'a1bbdf81-1111-4aea-beb3-3e5f433a3001',
      userId: 'user001',
      createdAt: new Date('2024-08-01T09:00:00.000Z'),
      type: TransactionType.EARNED,
      amount: 100,
    },
    {
      id: 'a1bbdf81-1111-4aea-beb3-3e5f433a3002',
      userId: 'user001',
      createdAt: new Date('2024-09-02T10:00:00.000Z'),
      type: TransactionType.SPENT,
      amount: 40,
    },
    {
      id: 'a1bbdf81-1111-4aea-beb3-3e5f433a3003',
      userId: 'user001',
      createdAt: new Date('2024-09-04T11:00:00.000Z'),
      type: TransactionType.PAYOUT,
      amount: 30,
    },
    {
      id: 'b2ccdf81-2222-4aea-beb3-3e5f433a3004',
      userId: 'user002',
      createdAt: new Date('2024-10-01T12:00:00.000Z'),
      type: TransactionType.EARNED,
      amount: 200,
    },
    {
      id: 'b2ccdf81-2222-4aea-beb3-3e5f433a3005',
      userId: 'user002',
      createdAt: new Date('2024-11-02T13:00:00.000Z'),
      type: TransactionType.SPENT,
      amount: 60,
    },
    {
      id: 'b2ccdf81-2222-4aea-beb3-3e5f433a3006',
      userId: 'user002',
      createdAt: new Date('2022-04-03T14:00:00.000Z'),
      type: TransactionType.PAYOUT,
      amount: 50,
    },
    {
      id: 'c3dddf81-3333-4aea-beb3-3e5f433a3007',
      userId: 'user003',
      createdAt: new Date('2021-04-04T15:00:00.000Z'),
      type: TransactionType.EARNED,
      amount: 300,
    },
    {
      id: 'c3dddf81-3333-4aea-beb3-3e5f433a3008',
      userId: 'user003',
      createdAt: new Date('2024-04-05T16:00:00.000Z'),
      type: TransactionType.SPENT,
      amount: 120,
    },
    {
      id: 'c3dddf81-3333-4aea-beb3-3e5f433a3009',
      userId: 'user003',
      createdAt: new Date('2024-04-06T17:00:00.000Z'),
      type: TransactionType.PAYOUT,
      amount: 80,
    },
    // Add more mock transactions as needed
  ]);

  console.log('Database seeded!');
  process.exit(0);
}

seed();