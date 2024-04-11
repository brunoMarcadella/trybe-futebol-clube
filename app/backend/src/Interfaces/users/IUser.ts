import { Identifiable } from '..';

export interface ILogin {
  email: string,
  password: string,
}

export interface IUser extends Identifiable, ILogin {
  username: string,
  role: string,
  email: string,
  password: string,
}

export type IUserResponse = Omit<IUser, 'password'>;
