import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import UserService from '../services/UserService';

export default class UserController {
  constructor(
    private userService = new UserService(),
  ) { }

  public async login(req: Request, res: Response) {
    const serviceResponse = await this.userService.login(req.body);

    if (serviceResponse.status !== 'SUCCESSFUL') {
      return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
    }

    return res.status(200).json(serviceResponse.data);
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
