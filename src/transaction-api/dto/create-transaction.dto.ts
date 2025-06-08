export class CreateTransactionDto {
  userId: string;
  amount: number;
  type: 'earned' | 'spent' | 'payout' | 'paidout';
  createdAt?: Date;
}
