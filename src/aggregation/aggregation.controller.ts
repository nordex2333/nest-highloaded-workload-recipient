import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { AggregationService } from './aggregation.service';
import { SwaggerDocs } from '../swagger/swagger-docs';
import { AggregationDto } from './dto/aggregation.dto';
import { PayoutDto } from '../payout/dto/payout.dto';

@ApiTags('Aggregation')
@Controller('aggregation')
export class AggregationController {
  constructor(private readonly aggregationService: AggregationService) {}

  @Get(':userId')
  @ApiOperation(SwaggerDocs.aggregation.getUserAggregation)
  @ApiParam(SwaggerDocs.aggregation.getUserAggregation.parameters[0])
  @ApiResponse({ status: 200, type: AggregationDto })
  async getUserAggregation(@Param('userId') userId: string): Promise<AggregationDto> {
    return this.aggregationService.aggregateDataByUserId(userId);
  }

  @Get('payouts/all')
  @ApiOperation(SwaggerDocs.aggregation.getAggregatedPayouts)
  @ApiResponse({ status: 200, type: [PayoutDto] })
  async getAggregatedPayouts(): Promise<PayoutDto[]> {
    return this.aggregationService.getAggregatedPayouts();
  }
}