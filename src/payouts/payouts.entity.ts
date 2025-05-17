import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity('payouts')
export class Payout {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  userId: string;

  @Column()
  amount: number;

  @Column()
  status: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}