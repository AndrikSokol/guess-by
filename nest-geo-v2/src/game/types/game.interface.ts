import { StatusGame } from '@/enum/status.enum';

export interface IGame {
  id: number;
  roomId: number;
  round: number;
  totalRounds: number;
  link: string;
  status: StatusGame;
}
