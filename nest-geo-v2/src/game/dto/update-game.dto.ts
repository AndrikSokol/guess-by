import { IsString } from 'class-validator';

export class UpdateGameDto {
  @IsString()
  link: string;
}
