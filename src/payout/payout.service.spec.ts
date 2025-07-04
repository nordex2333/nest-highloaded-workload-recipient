import { Test, TestingModule } from '@nestjs/testing';
import { PayoutService } from './payout.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from '../transaction-api/transaction.entity';
import { Repository } from 'typeorm';

let mockTransactions: Transaction[] = [
  { id: '1', userId: 'user1', type: 'payout', amount: 30, createdAt: new Date(), } as Transaction,
  { id: '2', userId: 'user1', type: 'payout', amount: 20, createdAt: new Date(), } as Transaction,
  { id: '3', userId: 'user2', type: 'payout', amount: 50, createdAt: new Date(), } as Transaction,
];

describe('PayoutService', () => {
  let service: PayoutService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayoutService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            find: jest.fn((opts) => {
              if (opts?.where?.type === 'payout' && opts?.where?.userId) {
                return mockTransactions.filter(
                  t => t.type === 'payout' && t.userId === opts.where.userId,
                );
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

    service = module.get<PayoutService>(PayoutService);
  });

  it('should aggregate requested payouts for all users', async () => {
    let result = await service.getRequestedPayouts();
    expect(result).toEqual([
      { userId: 'user1', payoutAmount: 50 },
      { userId: 'user2', payoutAmount: 50 },
    ]);
  });

  it('should aggregate payouts by userId', async () => {
    let result = await service.getRequestedPayouts();
    expect(result.find(r => r.userId === 'user1').payoutAmount).toBe(50);
  });
});
