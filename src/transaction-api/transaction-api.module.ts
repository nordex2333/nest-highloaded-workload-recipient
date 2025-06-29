import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionApiController } from './transaction-api.controller';
import { TransactionApiService } from './transaction-api.service';
import { Transaction } from './transaction.entity';
import { RedisPollerService } from '../redis/redis-poller.service';
import { UserAggregate } from '../aggregation/user-aggregate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, UserAggregate])],
  controllers: [TransactionApiController],
  providers: [TransactionApiService, RedisPollerService],
  exports: [TransactionApiService],
})
export class TransactionApiModule {}