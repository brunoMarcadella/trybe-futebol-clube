import { IResponseUpdateMatch } from '../Interfaces/matches/IResponseUpdateMatch';
import { GoalsType, IMatchModel } from '../Interfaces/matches/IMatchModel';
import MatchModel from '../models/MatchModel';
import { IMatch } from '../Interfaces/matches/IMatch';
import { ServiceResponse } from '../Interfaces/ServiceResponse';

export default class MatchService {
  constructor(
    private matchModel: IMatchModel = new MatchModel(),
  ) { }

  public async getAllMatches(): Promise<ServiceResponse<IMatch[]>> {
    const allMatches = await this.matchModel.findAll();
    return { status: 'SUCCESSFUL', data: allMatches };
  }

  public async getMatchById(id: number): Promise<ServiceResponse<IMatch>> {
    const match = await this.matchModel.findById(id);
    if (!match) return { status: 'NOT_FOUND', data: { message: `Match ${id} not found` } };
    return { status: 'SUCCESSFUL', data: match };
  }

  public async getAllMatchesByFilter(inProgress: boolean):
  Promise<ServiceResponse<IMatch[]>> {
    const allMatches = await this.matchModel.findAllByFilter(inProgress);

    return { status: 'SUCCESSFUL', data: allMatches };
  }

  public async finishMatch(id: number): Promise<ServiceResponse<IResponseUpdateMatch>> {
    const matchToUpdate = await this.matchModel.findById(id);

    if (!matchToUpdate) {
      return { status: 'NOT_FOUND', data: { message: `Match ${id} not found` } };
    }

    await this.matchModel.finishMatch(id);

    return { status: 'SUCCESSFUL', data: { message: 'Finished' } };
  }

  public async updateMatchGoals(id: number, goals: GoalsType):
  Promise<ServiceResponse<IResponseUpdateMatch>> {
    const matchToUpdate = await this.matchModel.findById(id);

    if (!matchToUpdate) {
      return { status: 'NOT_FOUND', data: { message: `Match ${id} not found` } };
    }

    await this.matchModel.updateMatchGoals(id, goals);

    return { status: 'SUCCESSFUL', data: { message: 'Finished' } };
  }

  public async createMatch(data: Omit<IMatch, 'id'>): Promise<ServiceResponse<IMatch>> {
    if (data.homeTeamId === data.awayTeamId) {
      return {
        status: 'UNPROCESSABLE_ENTITY',
        data: { message: 'It is not possible to create a match with two equal teams' },
      };
    }

    const homeTeam = await this.matchModel.findById(Number(data.homeTeamId));

    const awayTeam = await this.matchModel.findById(Number(data.homeTeamId));

    if (!homeTeam || !awayTeam) {
      return {
        status: 'NOT_FOUND',
        data: { message: 'There is no team with such id!' },
      };
    }

    const createdMatch = await this.matchModel.createMatch(data);

    return { status: 'SUCCESSFUL', data: createdMatch };
  }
}
