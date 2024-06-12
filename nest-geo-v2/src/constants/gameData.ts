import { StatusGame } from '@/enum/status.enum';
import { v4 as uuidv4 } from 'uuid';

const length = 150;

export const GAME_DATA = Array.from({ length }).map((_, index) => {
  const totalRounds = Math.round(1 + Math.random() * 9);

  return {
    roomId: index + 1,
    round: totalRounds,
    totalRounds: totalRounds,
    link: uuidv4(),
    status: StatusGame.FINISHED,
  };
});

export const GAME_LOCATIONS_DATA = (gameId: number, totalRounds: number) => {
  return Array.from({ length: totalRounds }).map((_, index) => {
    return {
      gameId,
      locationId: index + 1,
    };
  });
};
