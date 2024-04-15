import { ICRUDModelReader } from '../ICRUDModel';
import { IMatch } from './IMatch';

export interface IMatchModel extends ICRUDModelReader<IMatch> {
  findAllByFilter(inProgress: boolean): Promise<IMatch[]>,
}
