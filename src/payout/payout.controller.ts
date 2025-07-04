import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PayoutService } from './payout.service';
import { SwaggerDocs } from '../swagger/swagger-docs';
import { PayoutDto } from './dto/payout.dto';

@ApiTags('Payouts')
@Controller('payouts')
export class PayoutController {
  constructor(private readonly payoutService: PayoutService) {}

  @Get('requested')
  @ApiOperation(SwaggerDocs.payouts.getRequestedPayouts)
  @ApiResponse({ status: 200, type: [PayoutDto] })
  async getRequestedPayouts(
    @Query('limit') limit: string = '100',
    @Query('page') page: string = '1',
  ): Promise<{ items: PayoutDto[]; meta: any }> {
    let limitNum = parseInt(limit, 10) || 100;
    let pageNum = parseInt(page, 10) || 1;
    let { items, meta } = await this.payoutService.getRequestedPayoutsWithMeta({ limit: limitNum, page: pageNum });
    return { items, meta };
  }
}
