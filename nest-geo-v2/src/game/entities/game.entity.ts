import { StatusGame } from '@/enum/status.enum';
import { Location } from '@/location/entities/location.entity';
import { Room } from '@/room/entities/room.entity';
import { Score } from '@/score/entities/score.entity';
import {
  AfterUpdate,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: 'game' })
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'room_id' })
  roomId: number;

  @OneToOne(() => Room, (room) => room.game)
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @Column({ default: 1 })
  round: number;

  @Column({ name: 'total_rounds' })
  totalRounds: number;

  @Column()
  link: string;

  @Column({ enum: StatusGame, default: StatusGame.STARTED })
  status: StatusGame;
  @OneToMany(() => Score, (score) => score.game)
  scores: Score[];

  @ManyToMany(() => Location, (location) => location.games)
  @JoinTable()
  locations: Location[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  async addLink() {
    this.link = await uuidv4();
  }

  @AfterUpdate()
  async setStatus() {
    if (this.round === this.totalRounds) {
      this.status = StatusGame.FINISHED;
    }
  }

  constructor(partial: Partial<Game>) {
    Object.assign(this, partial);
  }
}
