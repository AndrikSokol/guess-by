import { IUser } from '../types/user.interface';

export class UserDto {
  id: number;
  email: string;
  username: string;

  constructor(model: Pick<IUser, 'id' | 'email' | 'username'>) {
    this.id = model.id;
    this.email = model.email;
    this.username = model.username;
  }
}
