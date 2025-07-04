import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionApiController } from './transaction-api.controller';
import { TransactionApiService } from './transaction-api.service';
import { Transaction } from './transaction.entity';
import { RedisPollerService } from '../redis/redis-poller.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  controllers: [TransactionApiController],
  providers: [TransactionApiService, RedisPollerService],
  exports: [TransactionApiService],
})
export class TransactionApiModule {}