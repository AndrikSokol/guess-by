import { Game } from '@/game/entities/game.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Link } from './link.entity';
import { Level } from '@/enum/level.enum';
import { LevelEntity } from '@/level/entities/level.entity';

@Entity({ name: 'location' })
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'pano_id' })
  panoId: string;

  @Column({ type: 'double precision' })
  lat: number;

  @Column({ type: 'double precision' })
  lng: number;

  @Column({ type: 'int' })
  heading: number;

  @Column({ type: 'int' })
  pitch: number;

  @Column({ name: 'image_date' })
  imageDate: string;

  @Column({ name: 'level_id' })
  levelId: number;

  @OneToMany(() => Link, (link) => link.location)
  links: Link[];

  @ManyToMany(() => Game, (game) => game.locations)
  games: Game[];

  @ManyToOne(() => LevelEntity, (level) => level.rooms)
  @JoinColumn({ name: 'level_id' })
  level: LevelEntity;

  constructor(partial: Partial<Location>) {
    Object.assign(this, partial);
  }
}
