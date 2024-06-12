import { UserRole } from '@/enum/userRole.enum';
import * as bcrypt from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);

const length = 150;

export const USER_DATA = Array.from({ length }).map((_, index) => {
  return {
    googleId: null,
    firstName: 'test',
    lastName: 'test',
    username: `test${index + 1}`,
    email: `test${index + 1}@gmail.com`,
    role: UserRole.User,
    passwordHash: bcrypt.hashSync('123', salt),
  };
});
