
import { Controller, Injectable,  Get, Query, Param } from '@nestjs/common';
import { TransactionApiService } from './transaction-api.service';

@Controller('transactions')
export class TransactionApiController {
  constructor(private readonly transactionApiService: TransactionApiService) {}

  @Get()
  async getTransactions(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 1000,
  ) {
    return this.transactionApiService.getTransactions(startDate, endDate, page, limit);
  }
}