import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataSource } from 'typeorm';

@ApiTags('Health')
@Controller()
export class AppController {

  constructor(private readonly dataSource: DataSource) {}

  @Get('/health')
  @ApiOperation({ summary: 'Health check', description: 'Checks the health of the application.' })
  @ApiResponse({ status: 200, description: 'healthy.' })
  healthCheck() {
    return { status: 'ok' };
  }

  @Get('/db-health')
  @ApiOperation({ summary: 'DB health check', description: 'Checks the health of the application and database connection.' })
  @ApiResponse({ status: 200, description: 'The db is connected to app.' })
  @ApiResponse({ status: 500, description: 'The db is not connected to app.' })
  async dbHealthCheck() {
    try {
      let isConnected = this.dataSource.isInitialized;

      if (isConnected) {
        return {
          status: 'ok',
          database: 'connected',
        };
      } else {
        throw new Error('Database not connected');
      }
    } catch (error) {
      console.error('Database connection error:', error);
      return {
        status: 'ok',
        database: 'disconnected',
      };
    }
  }

}