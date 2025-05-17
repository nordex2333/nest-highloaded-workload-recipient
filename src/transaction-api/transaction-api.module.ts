import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionApiController } from './transaction-api.controller';
import { TransactionApiService } from './transaction-api.service';
import { Transaction } from './transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  controllers: [TransactionApiController],
  providers: [TransactionApiService],
  exports: [TransactionApiService],
})
export class TransactionApiModule {}