import { Request, Response } from 'express';
import { ILeaderboard } from '../Interfaces/leaderboard/ILeaderboard';
import TeamService from '../services/TeamService';
import MatchService from '../services/MatchService';
import { IMatch } from '../Interfaces/matches/IMatch';
import { ServiceResponse } from '../Interfaces/ServiceResponse';

export default class LeaderboardAwayController {
  private teamService = new TeamService();
  private matchService = new MatchService();

  public async getAwayLeaderboard(_req: Request, res: Response) {
    const teams = await this.teamService.getAllTeams();
    const finishedMatches = await this.matchService.getAllMatchesByFilter(false);
    if (teams.status === 'SUCCESSFUL' && finishedMatches.status === 'SUCCESSFUL') {
      const leaderboardData = teams.data.map((team) => ({
        name: team.teamName,
        ...LeaderboardAwayController.getAwayTeamStats(team.id, finishedMatches),
      }));
      const newLeaderboard = LeaderboardAwayController
        .sortLeaderboard(leaderboardData as ILeaderboard[]);
      res.status(200).json(newLeaderboard);
    } else {
      res.status(500).json({ message: 'Database Error' });
    }
  }

  public static getAwayTeamStats(teamId: number, finishedMatches: ServiceResponse<IMatch[]>) {
    const stats = {
      totalPoints: LeaderboardAwayController.getTotalAwayPoints(teamId, finishedMatches),
      totalGames: LeaderboardAwayController.getTotalAwayGames(teamId, finishedMatches),
      totalVictories: LeaderboardAwayController.getTotalAwayVictories(teamId, finishedMatches),
      totalDraws: LeaderboardAwayController.getTotalAwayDraws(teamId, finishedMatches),
      totalLosses: LeaderboardAwayController.getTotalAwayLosses(teamId, finishedMatches),
      goalsFavor: LeaderboardAwayController.getTotalAwayGoalsFavor(teamId, finishedMatches),
      goalsOwn: LeaderboardAwayController.getTotalAwayGoalsOwn(teamId, finishedMatches),
      goalsBalance: LeaderboardAwayController.getTotalAwayGoalsBalance(teamId, finishedMatches),
      efficiency: LeaderboardAwayController.getTeamAwayEfficiency(teamId, finishedMatches),
    };
    return stats;
  }

  static sortLeaderboard(leaderboard: ILeaderboard[]) {
    const newLeaderboard = leaderboard.sort((a, b) => {
      if (a.totalPoints !== b.totalPoints) {
        return LeaderboardAwayController.sortByPoints(a, b);
      }
      if (a.totalVictories !== b.totalVictories) {
        return LeaderboardAwayController.sortByVictories(a, b);
      }
      if (a.goalsBalance !== b.goalsBalance) {
        return LeaderboardAwayController.sortByGoalsBalance(a, b);
      }
      return LeaderboardAwayController.sortByScoredGoals(a, b);
    });
    return newLeaderboard;
  }

  static sortByPoints(a: ILeaderboard, b: ILeaderboard) {
    if (a.totalPoints > b.totalPoints) {
      return -1;
    }
    if (a.totalPoints < b.totalPoints) {
      return 1;
    }
    return 0;
  }

  static sortByVictories(a: ILeaderboard, b: ILeaderboard) {
    if (a.totalVictories > b.totalVictories) {
      return -1;
    }
    if (a.totalVictories < b.totalVictories) {
      return 1;
    }
    return 0;
  }

  static sortByGoalsBalance(a: ILeaderboard, b: ILeaderboard) {
    if (a.goalsBalance > b.goalsBalance) {
      return -1;
    }
    if (a.goalsBalance < b.goalsBalance) {
      return 1;
    }
    return 0;
  }

  static sortByScoredGoals(a: ILeaderboard, b: ILeaderboard) {
    if (a.goalsFavor > b.goalsFavor) {
      return -1;
    }
    if (a.goalsFavor < b.goalsFavor) {
      return 1;
    }
    return 0;
  }

  static getTotalAwayPoints(teamId: number, finishedMatches: ServiceResponse<IMatch[]>) {
    if (finishedMatches.status === 'SUCCESSFUL') {
      let acc = 0;
      finishedMatches.data.reduce((_acc: number, match: IMatch) => {
        if (match.awayTeamId === teamId) {
          if (match.homeTeamGoals < match.awayTeamGoals) {
            acc += 3;
          }
          if (match.homeTeamGoals === match.awayTeamGoals) {
            acc += 1;
          }
        }
        return acc;
      }, acc);
      return acc;
    }
    return 0;
  }

  static getTotalAwayGames(teamId: number, finishedMatches: ServiceResponse<IMatch[]>) {
    if (finishedMatches.status === 'SUCCESSFUL') {
      let acc = 0;
      finishedMatches.data.reduce((_acc: number, match: IMatch) => {
        if (match.awayTeamId === teamId) {
          acc += 1;
        }
        return acc;
      }, acc);
      return acc;
    }
    return 0;
  }

  static getTotalAwayVictories(teamId: number, finishedMatches: ServiceResponse<IMatch[]>) {
    if (finishedMatches.status === 'SUCCESSFUL') {
      let acc = 0;
      finishedMatches.data.reduce((_acc: number, match: IMatch) => {
        if (match.awayTeamId === teamId && match.homeTeamGoals < match.awayTeamGoals) {
          acc += 1;
        }
        return acc;
      }, acc);
      return acc;
    }
    return 0;
  }

  static getTotalAwayDraws(teamId: number, finishedMatches: ServiceResponse<IMatch[]>) {
    if (finishedMatches.status === 'SUCCESSFUL') {
      let acc = 0;
      finishedMatches.data.reduce((_acc: number, match: IMatch) => {
        if (match.awayTeamId === teamId && match.homeTeamGoals === match.awayTeamGoals) {
          acc += 1;
        }
        return acc;
      }, acc);
      return acc;
    }
    return 0;
  }

  static getTotalAwayLosses(teamId: number, finishedMatches: ServiceResponse<IMatch[]>) {
    if (finishedMatches.status === 'SUCCESSFUL') {
      let acc = 0;
      finishedMatches.data.reduce((_acc: number, match: IMatch) => {
        if (match.awayTeamId === teamId && match.homeTeamGoals > match.awayTeamGoals) {
          acc += 1;
        }
        return acc;
      }, acc);
      return acc;
    }
    return 0;
  }

  static getTotalAwayGoalsFavor(teamId: number, finishedMatches: ServiceResponse<IMatch[]>) {
    if (finishedMatches.status === 'SUCCESSFUL') {
      let acc = 0;
      finishedMatches.data.reduce((_acc: number, match: IMatch) => {
        if (match.awayTeamId === teamId) {
          acc += match.awayTeamGoals;
        }
        return acc;
      }, acc);
      return acc;
    }
    return 0;
  }

  static getTotalAwayGoalsOwn(teamId: number, finishedMatches: ServiceResponse<IMatch[]>) {
    if (finishedMatches.status === 'SUCCESSFUL') {
      let acc = 0;
      finishedMatches.data.reduce((_acc: number, match: IMatch) => {
        if (match.awayTeamId === teamId) {
          acc += match.homeTeamGoals;
        }
        return acc;
      }, acc);
      return acc;
    }
    return 0;
  }

  static getTotalAwayGoalsBalance(teamId: number, finishedMatches: ServiceResponse<IMatch[]>) {
    if (finishedMatches.status === 'SUCCESSFUL') {
      let acc = 0;
      finishedMatches.data.reduce((_acc: number, match: IMatch) => {
        if (match.awayTeamId === teamId) {
          acc += match.awayTeamGoals;
          acc -= match.homeTeamGoals;
        }
        return acc;
      }, acc);
      return acc;
    }
    return 0;
  }

  static getTeamAwayEfficiency(teamId: number, finishedMatches: ServiceResponse<IMatch[]>) {
    const totalPoints = LeaderboardAwayController.getTotalAwayPoints(teamId, finishedMatches) ?? 0;
    const totalGames = LeaderboardAwayController.getTotalAwayGames(teamId, finishedMatches) ?? 0;

    const efficiency = (totalPoints / (totalGames * 3)) * 100;

    return efficiency.toFixed(2);
  }
}
