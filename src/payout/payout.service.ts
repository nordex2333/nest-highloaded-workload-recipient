import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionType } from '../transaction-api/transaction.entity';
import { UserAggregate } from '../aggregation/user-aggregate.entity';

@Injectable()
export class PayoutService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(UserAggregate)
    private readonly userAggregateRepository: Repository<UserAggregate>,
  ) {}

  async getRequestedPayouts(options?: { limit?: number; page?: number }) {
    let limit = options?.limit ?? 100;
    let page = options?.page ?? 1;
    let [items, totalItems] = await this.userAggregateRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    let filtered = items.filter(u => u.totalPayout > 0);
    return filtered.map(u => ({ userId: u.userId, payoutAmount: u.totalPayout }));
  }

  async getRequestedPayoutsWithMeta(options?: { limit?: number; page?: number }) {
    let limit = options?.limit ?? 100;
    let page = options?.page ?? 1;
    let [items, totalItems] = await this.userAggregateRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    let filtered = items.filter(u => u.totalPayout > 0);
    let totalPages = Math.ceil(totalItems / limit);
    return {
      items: filtered.map(u => ({ userId: u.userId, payoutAmount: u.totalPayout })),
      meta: {
        totalItems,
        itemCount: filtered.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }
}
