import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionApiService } from './transaction-api.service';
import { SwaggerDocs } from '../swagger/swagger-docs';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionApiController {
  constructor(private readonly transactionApiService: TransactionApiService) {}

  @Get()
  @ApiOperation(SwaggerDocs.transactions.getTransactions)
  @ApiResponse(SwaggerDocs.transactions.getTransactions.responses[200])
  async getTransactions(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 1000,
  ) {
    return this.transactionApiService.getTransactions(startDate, endDate, page, limit);
  }
}