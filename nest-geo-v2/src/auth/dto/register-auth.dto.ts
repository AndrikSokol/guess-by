import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterAuthDto {
  @ApiProperty({
    example: 'Andrei',
  })
  @IsOptional()
  @MinLength(2, { message: 'first name must be more than 2 char' })
  @MaxLength(25, { message: 'first name must less than 25 char' })
  @IsString()
  firstName?: string;

  @ApiProperty({
    example: 'Sakalouski',
  })
  @IsOptional()
  @MinLength(2, { message: 'last name must be more than 2 char' })
  @MaxLength(25, { message: 'last name must less than 25 char' })
  @IsString()
  lastName?: string;

  @ApiProperty({
    example: 'AndrikSokol31@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Andrik',
  })
  @MinLength(2, { message: 'username must be more than 2 char' })
  @MaxLength(25, { message: 'username must less than 25 char' })
  @IsString()
  username: string;

  @ApiProperty({
    example: 123,
  })
  @MinLength(2, { message: 'password must be more than 2 char' })
  @MaxLength(50, { message: 'username must less than 50 char' })
  @IsNotEmpty()
  password: string;
}
