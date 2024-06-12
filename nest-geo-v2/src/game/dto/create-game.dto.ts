import { Level } from '@/enum/level.enum';
import { IsEnum, IsNumber } from 'class-validator';

export class CreateGameDto {
  @IsNumber()
  roomId: number;

  @IsNumber()
  totalRounds: number;

  @IsEnum(Level)
  level: Level;
}
