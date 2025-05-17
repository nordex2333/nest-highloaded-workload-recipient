import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { AggregationService } from './aggregation.service';

@ApiTags('Aggregation')
@Controller('aggregation')
export class AggregationController {
  constructor(private readonly aggregationService: AggregationService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get aggregated data by userId' })
  @ApiParam({ name: 'userId', required: true, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Aggregated user data',
    schema: {
      example: {
        userId: '074092',
        balance: -40.8,
        earned: 1.2,
        spent: 12,
        payout: 30,
        paidOut: 30,
      },
    },
  })
async getUserAggregation(@Param('userId') userId: string) {
  return this.aggregationService.aggregateDataByUserId(userId);
}

  @Get('payouts/all')
  @ApiOperation({ summary: 'Get list of requested payouts aggregated by user' })
  @ApiResponse({
    status: 200,
    description: 'List of aggregated payouts',
    schema: {
      example: [
        { userId: '074092', payoutAmount: 30 },
        { userId: '123456', payoutAmount: 10 },
      ],
    },
  })
  async getAggregatedPayouts() {
    return this.aggregationService.getAggregatedPayouts();
  }
}