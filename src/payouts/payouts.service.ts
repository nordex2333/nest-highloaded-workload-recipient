import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../transaction-api/transaction.entity';

@Injectable()
export class PayoutsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async getRequestedPayouts() {
    let payouts = await this.transactionRepository.find({ where: { type: 'payout' } });
    let result: Record<string, number> = {};
    for (let tx of payouts) {
      result[tx.userId] = (result[tx.userId] || 0) + tx.amount;
    }
    return Object.entries(result).map(([userId, payoutAmount]) => ({ userId, payoutAmount }));
  }

  async getPayoutsByUserId(userId: string) {
    let payouts = await this.transactionRepository.find({
      where: { userId, type: 'payout' },
    });
    let total = payouts.reduce((sum, tx) => sum + tx.amount, 0);
    return { userId, payoutAmount: total };
  }
}