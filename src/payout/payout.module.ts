import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayoutService } from './payout.service';
import { PayoutController } from './payout.controller';
import { Transaction } from '../transaction-api/transaction.entity';
import { UserAggregate } from '../aggregation/user-aggregate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, UserAggregate])],
  controllers: [PayoutController],
  providers: [PayoutService],
  exports: [PayoutService],
})
export class PayoutModule {}
