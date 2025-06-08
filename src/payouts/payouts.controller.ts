import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PayoutsService } from './payouts.service';
import { SwaggerDocs } from '../swagger/swagger-docs';

@ApiTags('Payouts')
@Controller('payouts')
export class PayoutsController {
  constructor(private readonly payoutsService: PayoutsService) {}

  @Get('requested')
  @ApiOperation(SwaggerDocs.payouts.getRequestedPayouts)
  @ApiResponse(SwaggerDocs.payouts.getRequestedPayouts.responses[200])
  async getRequestedPayouts() {
    return this.payoutsService.getRequestedPayouts();
  }
}