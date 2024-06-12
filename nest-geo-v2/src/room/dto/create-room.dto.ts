import { Level } from '@/enum/level.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ enum: Level, default: Level.Easy })
  @IsEnum(Level)
  level: Level;
}
