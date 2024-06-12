import { Game } from '@/game/entities/game.entity';
import { User } from '@/user/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'score' })
export class Score {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;
  @ManyToOne(() => User, (user) => user.scores)
  @JoinColumn({ name: 'user_id' })
  user: User[];

  @Column({ name: 'game_id' })
  gameId: number;

  @ManyToOne(() => Game, (game) => game.scores)
  @JoinColumn({ name: 'game_id' })
  game: Game;

  @Column({ type: 'double precision' })
  score: number;

  @Column()
  round: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  constructor(partial: Partial<Score>) {
    Object.assign(this, partial);
  }
}
