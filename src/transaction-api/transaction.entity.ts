import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryColumn()
  id: string;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  type: string; // 'earned' | 'spent' | 'payout'

  @Column('float')
  amount: number;
}