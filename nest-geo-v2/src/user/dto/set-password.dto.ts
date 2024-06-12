import { IsNotEmpty, MinLength } from 'class-validator';

export class SetPasswordDto {
  @MinLength(2, { message: 'password must be more than 2 char' })
  @IsNotEmpty()
  newPassword: string;
}
