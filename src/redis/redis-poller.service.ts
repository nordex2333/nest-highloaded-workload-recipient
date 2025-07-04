import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { Transaction } from '../transaction-api/transaction.entity';
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
          } else {
            this.logger.warn('Remote API error: ' + data.error);
          }
        }
      });
    } catch (e) {
      this.logger.error('Polling error: ' + e.message);
    }
  }
}
