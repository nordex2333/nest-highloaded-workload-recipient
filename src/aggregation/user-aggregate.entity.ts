import { Entity, Column, ObjectIdColumn } from 'typeorm';

@Entity('user_aggregates')
export class UserAggregate {
  @ObjectIdColumn()
  id: string;

  @Column()
  userId: string;

  @Column()
  totalEarned: number;

  @Column()
  totalSpent: number;

  @Column()
  totalPayout: number;

  @Column()
  balance: number;
}
