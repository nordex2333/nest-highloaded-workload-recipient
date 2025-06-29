import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AggregationController } from './aggregation.controller';
import { AggregationService } from './aggregation.service';
import { Transaction } from '../transaction-api/transaction.entity';
import { UserAggregate } from './user-aggregate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, UserAggregate])],
  controllers: [AggregationController],
  providers: [AggregationService],
  exports: [AggregationService],
})
export class AggregationModule {}