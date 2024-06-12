export interface IUser {
  id: number;
  googleId: string | null;
  firstName: string | null;
  lastName: string | null;
  username: string;
  email: string;
  passwordHash: string | null;
  createdAt: Date;
  updatedAt: Date;
}
