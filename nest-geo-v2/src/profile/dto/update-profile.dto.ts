import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'Andrik' })
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty({ example: 'Sokol' })
  @IsString()
  @IsOptional()
  lastName: string;

  @Type(() => Date)
  @ApiProperty({ format: 'YYYY-MM-DD', example: '1995-12-17' })
  @IsDate()
  @IsOptional()
  birthdate: Date;

  @ApiProperty({
    example: '2024-04-29/9440461-a1871b07-b989-4acf-a1cc-504894bd3746.jpg',
  })
  @IsString()
  @IsOptional()
  avatar: string;
}
