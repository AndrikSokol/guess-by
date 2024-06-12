import { Level } from '@/enum/level.enum';
import { Location } from '@/location/entities/location.entity';
import { Room } from '@/room/entities/room.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'level' })
export class LevelEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ enum: Level })
  name: Level;

  @OneToMany(() => Room, (room) => room.level)
  rooms: Room[];

  @OneToMany(() => Location, (location) => location.level)
  locations: Location[];

  constructor(partial: Partial<Level>) {
    Object.assign(this, partial);
  }
}
