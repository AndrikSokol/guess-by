import { Status } from '@/enum/status.enum';
import { v4 as uuidv4 } from 'uuid';

const length = 150;

export const ROOM_DATA = Array.from({ length }).map((_, index) => {
  return {
    id: index + 1,
    levelId: 1,
    link: uuidv4(),
    status: Status.Finished,
  };
});

export const ROOM_USER = Array.from({ length }).map((_, index) => {
  return {
    roomdId: index + 1,
    userId: Math.round(Math.random() * 89 + 1),
  };
});
