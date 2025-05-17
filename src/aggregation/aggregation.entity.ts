import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity('aggregations')
export class Aggregation {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  userId: string;

  @Column()
  totalTransactions: number;

  @Column()
  totalPayouts: number;

  @Column()
  aggregatedData: any;
}