import { ParameterObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { TransactionType } from '../transaction-api/transaction.entity';

export const SwaggerDocs = {
  app: {
    healthCheck: {
      summary: 'Health check',
      description: 'Checks the health of the application.',
      responses: {
        200: {
          description: 'Application is healthy.',
          content: {
            'application/json': {
              example: { status: 'ok' },
            },
          },
        },
      },
    },
    dbHealthCheck: {
      summary: 'DB health check',
      description: 'Checks the health of the application and database connection.',
      responses: {
        200: {
          description: 'The database is connected to the application.',
          content: {
            'application/json': {
              example: {
                status: 'ok',
                database: 'connected',
              },
            },
          },
        },
        500: {
          description: 'The database is not connected to the application.',
          content: {
            'application/json': {
              example: {
                status: 'ok',
                database: 'disconnected',
              },
            },
          },
        },
      },
    },
  },
  aggregation: {
    getUserAggregation: {
      summary: 'Get aggregated data by userId',
      description: 'Returns aggregated data for a specific user.',      parameters: [
        {
          name: 'userId',
          in: 'path',
          required: true,
          description: 'User ID',
          schema: { type: 'string' },
        } as ParameterObject,
      ],
      responses: {
        200: {
          description: 'Aggregated user data',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  userId: { type: 'string' },
                  balance: { type: 'number' },
                  earned: { type: 'number' },
                  spent: { type: 'number' },
                  payout: { type: 'number' },
                  paidOut: { type: 'number' },
                },
              },
              example: {
                userId: '074092',
                balance: -40.8,
                earned: 1.2,
                spent: 12,
                payout: 30,
                paidOut: 30,
              },
            },
          },
        },
      },
    },
    getAggregatedPayouts: {
      summary: 'Get list of requested payouts aggregated by user',
      description: 'Returns a list of aggregated payouts for all users.',
      responses: {
        200: {
          description: 'List of aggregated payouts',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    userId: { type: 'string' },
                    payoutAmount: { type: 'number' },
                  },
                },
              },
              example: [
                { userId: '074092', payoutAmount: 30 },
                { userId: '123456', payoutAmount: 10 },
              ],
            },
          },
        },
      },
    },
  },
  payouts: {
    getRequestedPayouts: {
      summary: 'Get list of requested payouts',
      description: 'Returns a list of requested payouts aggregated by user.',
      responses: {
        200: {
          description: 'List of requested payouts',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    userId: { type: 'string' },
                    payoutAmount: { type: 'number' },
                  },
                },
              },
              example: [
                { userId: '074092', payoutAmount: 30 },
                { userId: '123456', payoutAmount: 10 },
              ],
            },
          },
        },
      },
    },
  },
  transactions: {
    getTransactions: {
      summary: 'Get list of transactions',
      description: 'Fetches a paginated list of transactions, optionally filtered by date range.',      parameters: [
        {
          name: 'startDate',
          in: 'query',
          required: false,
          description: 'Start date for filtering transactions (ISO format).',
          schema: { type: 'string', format: 'date-time' },
        } as ParameterObject,
        {
          name: 'endDate',
          in: 'query',
          required: false,
          description: 'End date for filtering transactions (ISO format).',
          schema: { type: 'string', format: 'date-time' },
        } as ParameterObject,
        {
          name: 'page',
          in: 'query',
          required: false,
          description: 'Page number for pagination.',
          schema: { type: 'integer', default: 1 },
        } as ParameterObject,
        {
          name: 'limit',
          in: 'query',
          required: false,
          description: 'Number of items per page.',
          schema: { type: 'integer', default: 1000 },
        } as ParameterObject,
      ],
      responses: {
        200: {
          description: 'List of transactions with pagination metadata.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',                      properties: {
                        id: { type: 'string' },
                        userId: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        type: { 
                          type: 'string', 
                          enum: Object.values(TransactionType),
                          description: 'Type of transaction (earned, spent, payout, paidout)'
                        },
                        amount: { type: 'number' },
                      },
                    },
                  },
                  meta: {
                    type: 'object',
                    properties: {
                      totalItems: { type: 'integer' },
                      itemCount: { type: 'integer' },
                      itemsPerPage: { type: 'integer' },
                      totalPages: { type: 'integer' },
                      currentPage: { type: 'integer' },
                    },
                  },
                },
              },
              example: {
                items: [
                  {                    id: '41bbdf81-735c-4aea-beb3-3e5f433a30c5',
                    userId: '074092',
                    createdAt: '2023-03-16T12:33:11.000Z',
                    type: TransactionType.PAYOUT,
                    amount: 30,
                  },
                ],
                meta: {
                  totalItems: 1,
                  itemCount: 1,
                  itemsPerPage: 1000,
                  totalPages: 1,
                  currentPage: 1,
                },
              },
            },
          },
        },
      },
    },
  },
};