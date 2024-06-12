import { IsNotEmpty } from 'class-validator';

type Coordination = {
  lat: number;
  lng: number;
};

export class AddScoreDto {
  @IsNotEmpty()
  location: Coordination;

  @IsNotEmpty()
  marker: Coordination;

  @IsNotEmpty()
  link: string;
}
