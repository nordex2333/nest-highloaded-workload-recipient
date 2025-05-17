import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../transaction-api/transaction.entity';

@Injectable()
export class AggregationService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async aggregateDataByUserId(userId: string) {
    let transactions = await this.transactionRepository.find({ where: { userId } });

    let earned = 0, spent = 0, payout = 0, paidOut = 0;
    for (let tx of transactions) {
      if (tx.type === 'earned') earned += tx.amount;
      if (tx.type === 'spent') spent += tx.amount;
      if (tx.type === 'payout') {
        payout += tx.amount;
        paidOut += tx.amount;
      }
    }
    let balance = earned - spent - paidOut;

    return { userId, balance, earned, spent, payout, paidOut };
  }

  async getAggregatedPayouts() {
    let payouts = await this.transactionRepository.find({ where: { type: 'payout' } });
    let result: Record<string, number> = {};
    for (let tx of payouts) {
      result[tx.userId] = (result[tx.userId] || 0) + tx.amount;
    }
    return Object.entries(result).map(([userId, payoutAmount]) => ({ userId, payoutAmount }));
  }
}