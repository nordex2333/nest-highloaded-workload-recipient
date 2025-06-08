import { TransactionType } from '../../transaction-api/transaction.entity';

export class AggregationDto {
  userId: string;
  balance: number;
  totals: Record<TransactionType, number>;
}
