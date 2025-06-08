import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionApiService } from './transaction-api.service';
import { SwaggerDocs } from '../swagger/swagger-docs';
import { TransactionListResponseDto } from './dto/transaction-list-response.dto';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionApiController {
  constructor(private readonly transactionApiService: TransactionApiService) {}

  @Get()
  @ApiOperation(SwaggerDocs.transactions.getTransactions)
  @ApiResponse({
    status: 200,
    type: TransactionListResponseDto,
    description: 'List of transactions with pagination meta',
  })
  async getTransactions(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 1000,
  ): Promise<TransactionListResponseDto> {
    return this.transactionApiService.getTransactions(startDate, endDate, page, limit);
  }
}