import { Controller, Get } from '@nestjs/common';
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
  async getRequestedPayouts(): Promise<PayoutDto[]> {
    return this.payoutService.getRequestedPayouts();
  }
}
