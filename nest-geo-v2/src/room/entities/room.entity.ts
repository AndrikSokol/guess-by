import { Level } from '@/enum/level.enum';
import { Status } from '@/enum/status.enum';
import { Game } from '@/game/entities/game.entity';
import { LevelEntity } from '@/level/entities/level.entity';
import { User } from '@/user/entities/user.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: 'room' })
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'level_id', nullable: true })
  levelId: number;

  @OneToOne(() => Game, (game) => game.room)
  game: Game;

  @ManyToMany(() => User, (user) => user.rooms)
  @JoinTable()
  users: User[];

  @Column()
  link: string;

  @Column({ enum: Status })
  status: Status;

  @ManyToOne(() => LevelEntity, (level) => level.rooms)
  @JoinColumn({ name: 'level_id' })
  level: LevelEntity;

  @BeforeInsert()
  async addLink() {
    this.link = await uuidv4();
  }

  constructor(partial: Partial<Room>) {
    Object.assign(this, partial);
  }
}
