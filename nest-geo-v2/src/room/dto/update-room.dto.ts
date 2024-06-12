import { Level } from '@/enum/level.enum';
import { ApiProperty } from '@nestjs/swagger';

import { IsEnum } from 'class-validator';

export class UpdateRoomDto {
  @ApiProperty({ enum: Level })
  @IsEnum(Level)
  level: Level;
}
