import { Request, Response } from 'express';
import MatchService from '../services/MatchService';
import mapStatusHTTP from '../utils/mapStatusHTTP';

export default class MatchController {
  constructor(
    private matchService = new MatchService(),
  ) { }

  public async getAllMatches(req: Request, res: Response) {
    const { inProgress } = req.query;
    if (inProgress !== undefined) {
      let booleanValue: boolean;
      if (inProgress === 'true') {
        booleanValue = true;
      } else {
        booleanValue = false;
      }
      const serviceResponse = await this.matchService.getAllMatchesByFilter(booleanValue);
      res.status(200).json(serviceResponse.data);
    } else {
      const serviceResponse = await this.matchService.getAllMatches();
      res.status(200).json(serviceResponse.data);
    }
  }

  public async getMatchById(req: Request, res: Response) {
    const { id } = req.params;
    const serviceResponse = await this.matchService.getMatchById(Number(id));

    if (serviceResponse.status !== 'SUCCESSFUL') {
      return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
    }

    return res.status(200).json(serviceResponse.data);
  }

  public async finishMatch(req: Request, res: Response) {
    const { id } = req.params;
    const serviceResponse = await this.matchService.finishMatch(Number(id));

    if (serviceResponse.status !== 'SUCCESSFUL') {
      return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
    }

    return res.status(200).json(serviceResponse.data);
  }

  public async updateMatchGoals(req: Request, res: Response) {
    const { id } = req.params;
    const data = req.body;
    const serviceResponse = await this.matchService.updateMatchGoals(Number(id), data);

    if (serviceResponse.status !== 'SUCCESSFUL') {
      return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
    }

    return res.status(200).json(serviceResponse.data);
  }
}
