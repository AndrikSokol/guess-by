import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({
    example: 'AndrikSokol31@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 123,
  })
  @MinLength(2, { message: 'password must be more than 2 char' })
  @MaxLength(50, { message: 'username must less than 50 char' })
  @IsString()
  password: string;
}
