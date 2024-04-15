import { Request, Response } from 'express';
import { IRequestUser, IUser } from '../Interfaces/users/IUser';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import UserService from '../services/UserService';

export default class UserController {
  constructor(
    private userService = new UserService(),
  ) { }

  public async login(req: Request, res: Response): Promise<Response> {
    const serviceResponse = await this.userService.login(req.body);

    if (serviceResponse.status !== 'SUCCESSFUL') {
      return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
    }

    return res.status(200).json(serviceResponse.data);
  }

  public async getUserRole(req: IRequestUser, res: Response): Promise<Response> {
    const { email } = req;
    const serviceResponse = await this.userService.getUserByEmail(email as unknown as string);

    if (serviceResponse.status !== 'SUCCESSFUL') {
      return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
    }

    const userData = serviceResponse.data as IUser;
    return res.status(200).json({ role: userData.role });
  }

  // public async getAllTeams(_req: Request, res: Response) {
  //   const serviceResponse = await this.teamService.getAllTeams();
  //   res.status(200).json(serviceResponse.data);
  // }

  // public async getTeamById(req: Request, res: Response) {
  //   const { id } = req.params;
  //   const serviceResponse = await this.teamService.getTeamById(Number(id));

  //   if (serviceResponse.status !== 'SUCCESSFUL') {
  //     return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
  //   }

  //   return res.status(200).json(serviceResponse.data);
  // }
}
