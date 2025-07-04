import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionType } from '../transaction-api/transaction.entity';

@Injectable()
export class PayoutService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}
  async getRequestedPayouts(options?: { limit?: number; page?: number }) {
    let limit = options?.limit ?? 100;
    let page = options?.page ?? 1;
    let payouts = await this.transactionRepository.find({
      where: { type: TransactionType.PAYOUT },
      skip: (page - 1) * limit,
      take: limit,
    });
    let result: Record<string, number> = {};
    for (let tx of payouts) {
      result[tx.userId] = (result[tx.userId] || 0) + tx.amount;
    }
    return Object.entries(result).map(([userId, payoutAmount]) => ({ userId, payoutAmount }));
  }

  async getRequestedPayoutsWithMeta(options?: { limit?: number; page?: number }) {
    let limit = options?.limit ?? 100;
    let page = options?.page ?? 1;
    let [payouts, totalItems] = await this.transactionRepository.findAndCount({
      where: { type: TransactionType.PAYOUT },
      skip: (page - 1) * limit,
      take: limit,
    });
    let result: Record<string, number> = {};
    for (let tx of payouts) {
      result[tx.userId] = (result[tx.userId] || 0) + tx.amount;
    }
    let items = Object.entries(result).map(([userId, payoutAmount]) => ({ userId, payoutAmount }));
    let totalPages = Math.ceil(totalItems / limit);
    return {
      items,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }
}
