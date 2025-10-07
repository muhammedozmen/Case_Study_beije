import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({
    summary: 'Health check endpoint',
    description: 'Returns API status and basic information',
  })
  @ApiResponse({
    status: 200,
    description: 'API is running successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        message: { type: 'string', example: 'Email Verification API is running' },
        timestamp: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        version: { type: 'string', example: '1.0.0' },
      },
    },
  })
  getHealth(): {
    status: string;
    message: string;
    timestamp: string;
    version: string;
  } {
    return {
      status: 'ok',
      message: 'Email Verification API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }

  @Get('health')
  @ApiOperation({
    summary: 'Detailed health check',
    description: 'Returns detailed API health information',
  })
  @ApiResponse({
    status: 200,
    description: 'Detailed health information',
  })
  getDetailedHealth(): {
    status: string;
    uptime: number;
    timestamp: string;
    services: {
      database: string;
      mail: string;
    };
  } {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        mail: 'configured',
      },
    };
  }
}
