import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { Transaction, TransactionType } from '../transaction-api/transaction.entity';
import { UserAggregate } from '../aggregation/user-aggregate.entity';
import configuration from '../config/configuration';

let redisConfig = configuration().redis;
let redisPublisher = new Redis({ host: redisConfig.host, port: redisConfig.port });
let redisSubscriber = new Redis({ host: redisConfig.host, port: redisConfig.port });

@Injectable()
export class RedisPollerService {
  private readonly logger = new Logger(RedisPollerService.name);
  private polling = false;

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(UserAggregate)
    private readonly userAggregateRepository: Repository<UserAggregate>,
  ) {}

  startPolling() {
    if (this.polling) return;
    this.polling = true;
    setInterval(() => this.fetchAndInsert(), 12000); // 5 times per minute
  }

  async fetchAndInsert() {
    try {
      await redisSubscriber.subscribe('transaction:response');
      await redisPublisher.publish('transaction:fetch', 'request');
      redisSubscriber.once('message', async (channel, message) => {
        if (channel === 'transaction:response') {
          let data = JSON.parse(message);
          if (Array.isArray(data)) {
            // transform data flat array of objects
            let transactions: Transaction[] = (data as any[]).reduce((acc, item) => {
              if (Array.isArray(item)) {
                return acc.concat(item.map((i: any) => this.transactionRepository.create(i)));
              } else {
                acc.push(this.transactionRepository.create(item));
                return acc;
              }
            }, [] as Transaction[]);
            await this.transactionRepository.save(transactions);
            this.logger.log(`Inserted ${transactions.length} transactions from remote API.`);

            // call aggregation method
            await this.updateUserAggregates(transactions);
          } else {
            this.logger.warn('Remote API error: ' + data.error);
          }
        }
      });
    } catch (e) {
      this.logger.error('Polling error: ' + e.message);
    }
  }

  private async updateUserAggregates(transactions: Transaction[]) {
    let userMap: Record<string, { earned: number; spent: number; payout: number }> = {};
    for (let tx of transactions) {
      if (!userMap[tx.userId]) {
        userMap[tx.userId] = { earned: 0, spent: 0, payout: 0 };
      }
      if (tx.type === TransactionType.EARNED) userMap[tx.userId].earned += tx.amount;
      if (tx.type === TransactionType.SPENT) userMap[tx.userId].spent += tx.amount;
      if (tx.type === TransactionType.PAYOUT) userMap[tx.userId].payout += tx.amount;
    }
    for (let [userId, agg] of Object.entries(userMap)) {
      let existing = await this.userAggregateRepository.findOne({ where: { userId } });
      if (!existing) {
        existing = this.userAggregateRepository.create({
          userId,
          totalEarned: 0,
          totalSpent: 0,
          totalPayout: 0,
          balance: 0,
        });
      }
      existing.totalEarned += agg.earned;
      existing.totalSpent += agg.spent;
      existing.totalPayout += agg.payout;
      existing.balance = existing.totalEarned - existing.totalSpent - existing.totalPayout;
      await this.userAggregateRepository.save(existing);
    }
    this.logger.log('User aggregates updated.');
  }
}
