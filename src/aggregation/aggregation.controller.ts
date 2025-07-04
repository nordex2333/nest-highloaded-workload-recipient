import { Controller, Get, Param, Query } from '@nestjs/common';
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
  async getAggregatedPayouts(
    @Query('limit') limit: string = '100',
    @Query('page') page: string = '1',
  ): Promise<{ items: PayoutDto[]; meta: any }> {
    let limitNum = parseInt(limit, 10) || 100;
    let pageNum = parseInt(page, 10) || 1;
    let { items, meta } = await this.aggregationService.getAggregatedPayoutsWithMeta({ limit: limitNum, page: pageNum });
    return { items, meta };
  }
}