import {
  Entity,
  Column,
  ObjectId,
  ObjectIdColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'log' })
export class LogMongo {
  @ObjectIdColumn({ unique: true })
  _id: ObjectId;

  @Column()
  public context: string;

  @Column()
  public message: string;

  @Column()
  public level: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  constructor(partial: Partial<LogMongo>) {
    Object.assign(this, partial);
  }
}
