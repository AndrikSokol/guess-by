import { Level } from '@/enum/level.enum';

export interface IRoom {
  id: number;
  level: Level;
  link: string;
  createdAt: Date;
  updatedAt: Date;
}
