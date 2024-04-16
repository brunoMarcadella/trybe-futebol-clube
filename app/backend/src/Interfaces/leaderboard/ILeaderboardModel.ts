// import { ICRUDModelReader } from '../ICRUDModel';
import { ILeaderboard } from './ILeaderboard';

export interface ILeaderboardModel {
  findAll(): Promise<ILeaderboard[]>,
}
