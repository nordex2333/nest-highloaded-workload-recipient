import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { AggregationService } from './aggregation.service';
import { SwaggerDocs } from '../swagger/swagger-docs';

@ApiTags('Aggregation')
@Controller('aggregation')
export class AggregationController {
  constructor(private readonly aggregationService: AggregationService) {}

  @Get(':userId')
  @ApiOperation(SwaggerDocs.aggregation.getUserAggregation)
  @ApiParam(SwaggerDocs.aggregation.getUserAggregation.parameters[0])
  @ApiResponse(SwaggerDocs.aggregation.getUserAggregation.responses[200])
  async getUserAggregation(@Param('userId') userId: string) {
    return this.aggregationService.aggregateDataByUserId(userId);
  }

  @Get('payouts/all')
  @ApiOperation(SwaggerDocs.aggregation.getAggregatedPayouts)
  @ApiResponse(SwaggerDocs.aggregation.getAggregatedPayouts.responses[200])
  async getAggregatedPayouts() {
    return this.aggregationService.getAggregatedPayouts();
  }
}