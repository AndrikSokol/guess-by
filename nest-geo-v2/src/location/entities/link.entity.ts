import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Location } from './location.entity';

@Entity({ name: 'link' })
export class Link {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  link: string;

  @Column({ name: 'location_id' })
  locationId: string;

  @ManyToOne(() => Location, (location) => location.links)
  @JoinColumn({ name: 'location_id' })
  location: Location;
}
