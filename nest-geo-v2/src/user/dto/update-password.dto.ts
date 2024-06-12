import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @MinLength(2, { message: 'password must be more than 2 char' })
  @IsNotEmpty()
  newPassword: string;
}
