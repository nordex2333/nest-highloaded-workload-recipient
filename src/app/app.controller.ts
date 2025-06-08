import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { SwaggerDocs } from '../swagger/swagger-docs';

@ApiTags('Health')
@Controller()
export class AppController {

  constructor(private readonly dataSource: DataSource) {}

  @Get('/health')
  @ApiOperation(SwaggerDocs.app.healthCheck)
  @ApiResponse(SwaggerDocs.app.healthCheck.responses[200])
  healthCheck() {
    return { status: 'ok' };
  }

  @Get('/db-health')
  @ApiOperation(SwaggerDocs.app.dbHealthCheck)
  @ApiResponse(SwaggerDocs.app.dbHealthCheck.responses[200])
  @ApiResponse(SwaggerDocs.app.dbHealthCheck.responses[500])
  async dbHealthCheck() {
    let isConnected = this.dataSource.isInitialized;

    if (isConnected) {
      return { status: 'ok', database: 'connected' };
    }

    console.error('Database connection error: Database not connected');
    return { status: 'ok', database: 'disconnected' };
  }

}