import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionType } from '../transaction-api/transaction.entity';

@Injectable()
export class PayoutsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}
  async getRequestedPayouts() {
    let payouts = await this.transactionRepository.find({ where: { type: TransactionType.PAYOUT } });
    let result: Record<string, number> = {};
    for (let tx of payouts) {
      result[tx.userId] = (result[tx.userId] || 0) + tx.amount;
    }
    return Object.entries(result).map(([userId, payoutAmount]) => ({ userId, payoutAmount }));
  }
}