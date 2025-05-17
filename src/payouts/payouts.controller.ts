import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PayoutsService } from './payouts.service';

@ApiTags('Payouts')
@Controller('payouts')
export class PayoutsController {
  constructor(private readonly payoutsService: PayoutsService) {}

  @Get('requested')
  @ApiOperation({ summary: 'Get list of requested payouts aggregated by user' })
  @ApiResponse({
    status: 200,
    description: 'List of requested payouts (aggregated by user)',
    schema: {
      example: [
        { userId: '074092', payoutAmount: 30 },
        { userId: '123456', payoutAmount: 10 },
      ],
    },
  })
  async getRequestedPayouts() {
    return this.payoutsService.getRequestedPayouts();
  }
}