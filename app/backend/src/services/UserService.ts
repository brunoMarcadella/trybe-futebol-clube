import * as bcrypt from 'bcryptjs';
import { ServiceMessage, ServiceResponse } from '../Interfaces/ServiceResponse';
import { IUserModel } from '../Interfaces/users/IUserModel';
import UserModel from '../models/UserModel';
import { ILogin, IUser } from '../Interfaces/users/IUser';
import { IToken } from '../Interfaces/login/IToken';
import JWT from '../utils/JWT';

export default class UserService {
  constructor(
    private userModel: IUserModel = new UserModel(),
    private jwtService = JWT,
  ) { }

  public async login(data: ILogin): Promise<ServiceResponse<ServiceMessage | IToken>> {
    const user = await this.userModel.findByEmail(data.email);
    if (user) {
      if (!bcrypt.compareSync(data.password, user.password)) {
        return { status: 'UNAUTHORIZED', data: { message: 'Invalid email or password' } };
      }
      const { email } = user as IUser;
      const token = this.jwtService.sign({ email });
      return { status: 'SUCCESSFUL', data: { token } };
    }
    return { status: 'UNAUTHORIZED', data: { message: 'Invalid email or password' } };
  }

  public async getUserByEmail(email: string): Promise<ServiceResponse<ServiceMessage | IUser>> {
    const user = await this.userModel.findByEmail(email);
    if (!user) {
      return { status: 'NOT_FOUND', data: { message: 'User not found' } };
    }

    return { status: 'SUCCESSFUL', data: user };
  }

  // public async getAllTeams(): Promise<ServiceResponse<ITeam[]>> {
  //   const allTeams = await this.teamModel.findAll();
  //   return { status: 'SUCCESSFUL', data: allTeams };
  // }

  // public async getTeamById(id: number): Promise<ServiceResponse<ITeam>> {
  //   const team = await this.teamModel.findById(id);
  //   if (!team) return { status: 'NOT_FOUND', data: { message: `Team ${id} not found` } };
  //   return { status: 'SUCCESSFUL', data: team };
  // }
}
