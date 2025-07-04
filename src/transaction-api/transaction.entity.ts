import { Entity, Column, PrimaryColumn, CreateDateColumn, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

export enum TransactionType {
  EARNED = 'earned',
  SPENT = 'spent',
  PAYOUT = 'payout',
  // PAID_OUT = 'paidout'
}

@Entity('transactions')
export class Transaction {
  @ObjectIdColumn()
  _id: ObjectId;

  @PrimaryColumn()
  id: string;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: TransactionType,
    default: TransactionType.EARNED
  })
  type: TransactionType;

  @Column('float')
  amount: number;
}