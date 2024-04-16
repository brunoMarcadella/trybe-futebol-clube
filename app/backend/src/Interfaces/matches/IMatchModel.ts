import { ICRUDModelReader } from '../ICRUDModel';
import { IMatch } from './IMatch';

export type GoalsType = {
  homeTeamGoals: number,
  awayTeamGoals: number,
};

export interface IMatchModel extends ICRUDModelReader<IMatch> {
  findAllByFilter(inProgress: boolean): Promise<IMatch[]>,
  finishMatch(id: number): Promise<void>,
  updateMatchGoals(id: number, goals: GoalsType): Promise<void>,
}
