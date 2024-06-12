import { IsEmail, IsString } from 'class-validator';

export class GoogleAuthDto {
  @IsString()
  googleId: string;

  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  photo: string;
}
