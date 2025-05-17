import { Injectable } from '@nestjs/common';
import { AggregationService } from '../aggregation/aggregation.service';
import { PayoutsService } from '../payouts/payouts.service';

@Injectable()
export class AppService {
  constructor(
    private readonly aggregationService: AggregationService,
    private readonly payoutsService: PayoutsService,
  ) {}

  async getAggregatedDataByUserId(userId: string) {
    return this.aggregationService.aggregateDataByUserId(userId);
  }

  async getRequestedPayouts(userId: string) {
    return this.payoutsService.getPayoutsByUserId(userId);
  }
}