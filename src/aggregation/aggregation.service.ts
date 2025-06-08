import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionType } from '../transaction-api/transaction.entity';

@Injectable()
export class AggregationService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async aggregateDataByUserId(userId: string) {
    let transactions = await this.transactionRepository.find({ where: { userId } });

    let totals: Record<TransactionType, number> = {
      [TransactionType.EARNED]: 0,
      [TransactionType.SPENT]: 0,
      [TransactionType.PAYOUT]: 0,
    };

    for (let tx of transactions) {
      if (totals[tx.type] !== undefined) {
        totals[tx.type] += tx.amount;
      }
    }

    let balance = totals[TransactionType.EARNED] - totals[TransactionType.SPENT] - totals[TransactionType.PAYOUT];

    return {
      userId,
      balance,
      totals,
    };
  }

  async getAggregatedPayouts() {
    let payouts = await this.transactionRepository.find({ where: { type: TransactionType.PAYOUT } });
    let result: Record<string, number> = {};
    for (let tx of payouts) {
      result[tx.userId] = (result[tx.userId] || 0) + tx.amount;
    }
    return Object.entries(result).map(([userId, payoutAmount]) => ({ userId, payoutAmount }));
  }
}