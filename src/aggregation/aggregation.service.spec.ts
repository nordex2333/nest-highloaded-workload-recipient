import { Test, TestingModule } from '@nestjs/testing';
import { AggregationService } from './aggregation.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from '../transaction-api/transaction.entity';
import { Repository } from 'typeorm';

let mockTransactions: Transaction[] = [
  { id: '1', userId: 'user1', type: 'earned', amount: 100, createdAt: new Date(), } as Transaction,
  { id: '2', userId: 'user1', type: 'spent', amount: 40, createdAt: new Date(), } as Transaction,
  { id: '3', userId: 'user1', type: 'payout', amount: 30, createdAt: new Date(), } as Transaction,
  { id: '4', userId: 'user2', type: 'earned', amount: 200, createdAt: new Date(), } as Transaction,
  { id: '5', userId: 'user2', type: 'payout', amount: 50, createdAt: new Date(), } as Transaction,
];

describe('AggregationService', () => {
  let service: AggregationService;
  let repo: Repository<Transaction>;

  beforeEach(async () => {
    let module: TestingModule = await Test.createTestingModule({
      providers: [
        AggregationService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            find: jest.fn((opts) => {
              if (opts?.where?.userId) {
                return mockTransactions.filter(t => t.userId === opts.where.userId);
              }
              if (opts?.where?.type === 'payout') {
                return mockTransactions.filter(t => t.type === 'payout');
              }
              return mockTransactions;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AggregationService>(AggregationService);
    repo = module.get<Repository<Transaction>>(getRepositoryToken(Transaction));
  });

  it('should aggregate user data correctly', async () => {
    let result = await service.aggregateDataByUserId('user1');
    expect(result).toEqual({
      userId: 'user1',
      balance: 30,
      earned: 100,
      spent: 40,
      payout: 30,
      paidOut: 30,
    });
  });

  it('should aggregate payout for all users', async () => {
    let result = await service.getAggregatedPayouts();
    expect(result).toEqual([
      { userId: 'user1', payoutAmount: 50 },
      { userId: 'user2', payoutAmount: 50 },
    ]);
  });
});