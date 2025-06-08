import { Transaction, TransactionType } from '../transaction.entity';

export class TransactionListMetaDto {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export class TransactionListResponseDto {
  items: Array<{
    id: string;
    userId: string;
    createdAt: Date;
    type: TransactionType;
    amount: number;
  }>;
  meta: TransactionListMetaDto;
}
