import { Request, Response } from 'express';
import { IMatch } from '../Interfaces/matches/IMatch';
import { ServiceResponse } from '../Interfaces/ServiceResponse';
import { ILeaderboard } from '../Interfaces/leaderboard/ILeaderboard';
import TeamService from '../services/TeamService';
import MatchService from '../services/MatchService';

export default class LeaderboardHomeController {
  private teamService = new TeamService();
  private matchService = new MatchService();

  public async getHomeLeaderboard(_req: Request, res: Response) {
    const teams = await this.teamService.getAllTeams();
    const finishedMatches = await this.matchService.getAllMatchesByFilter(false);
    if (teams.status === 'SUCCESSFUL' && finishedMatches.status === 'SUCCESSFUL') {
      const leaderboardData = teams.data.map((team) => ({
        name: team.teamName,
        ...LeaderboardHomeController.getHomeTeamStats(team.id, finishedMatches),
      }));
      const newLeaderboard = LeaderboardHomeController
        .sortLeaderboard(leaderboardData as ILeaderboard[]);
      res.status(200).json(newLeaderboard);
    } else {
      res.status(500).json({ message: 'Database Error' });
    }
  }

  public static getHomeTeamStats(teamId: number, finishedMatches: ServiceResponse<IMatch[]>) {
    const stats = {
      totalPoints: LeaderboardHomeController.getTotalHomePoints(teamId, finishedMatches),
      totalGames: LeaderboardHomeController.getTotalHomeGames(teamId, finishedMatches),
      totalVictories: LeaderboardHomeController.getTotalHomeVictories(teamId, finishedMatches),
      totalDraws: LeaderboardHomeController.getTotalHomeDraws(teamId, finishedMatches),
      totalLosses: LeaderboardHomeController.getTotalHomeLosses(teamId, finishedMatches),
      goalsFavor: LeaderboardHomeController.getTotalHomeGoalsFavor(teamId, finishedMatches),
      goalsOwn: LeaderboardHomeController.getTotalHomeGoalsOwn(teamId, finishedMatches),
      goalsBalance: LeaderboardHomeController.getTotalHomeGoalsBalance(teamId, finishedMatches),
      efficiency: LeaderboardHomeController.getTeamHomeEfficiency(teamId, finishedMatches),
    };
    return stats;
  }

  static sortLeaderboard(leaderboard: ILeaderboard[]) {
    const newLeaderboard = leaderboard.sort((a, b) => {
      if (a.totalPoints !== b.totalPoints) {
        return LeaderboardHomeController.sortByPoints(a, b);
      }
      if (a.totalVictories !== b.totalVictories) {
        return LeaderboardHomeController.sortByVictories(a, b);
      }
      if (a.goalsBalance !== b.goalsBalance) {
        return LeaderboardHomeController.sortByGoalsBalance(a, b);
      }
      return LeaderboardHomeController.sortByScoredGoals(a, b);
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

  public static getTotalHomePoints(
    teamId: number,
    finishedMatches: ServiceResponse<IMatch[]>,
  ): number {
    if (finishedMatches.status === 'SUCCESSFUL') {
      let acc = 0;
      finishedMatches.data.reduce((_acc: number, match: IMatch) => {
        if (match.homeTeamId === teamId) {
          if (match.homeTeamGoals > match.awayTeamGoals) acc += 3;
          if (match.homeTeamGoals === match.awayTeamGoals) acc += 1;
        }
        return acc;
      }, acc);
      return acc;
    }
    return 0;
  }

  public static getTotalHomeGames(teamId: number, finishedMatches: ServiceResponse<IMatch[]>) {
    if (finishedMatches.status === 'SUCCESSFUL') {
      let acc = 0;
      finishedMatches.data.reduce((_acc: number, match: IMatch) => {
        if (match.homeTeamId === teamId) {
          acc += 1;
        }
        return acc;
      }, acc);
      return acc;
    }
    return 0;
  }

  public static getTotalHomeVictories(teamId: number, finishedMatches: ServiceResponse<IMatch[]>) {
    if (finishedMatches.status === 'SUCCESSFUL') {
      let acc = 0;
      finishedMatches.data.reduce((_acc: number, match: IMatch) => {
        if (match.homeTeamId === teamId && match.homeTeamGoals > match.awayTeamGoals) {
          acc += 1;
        }
        return acc;
      }, acc);
      return acc;
    }
    return 0;
  }

  public static getTotalHomeDraws(teamId: number, finishedMatches: ServiceResponse<IMatch[]>) {
    if (finishedMatches.status === 'SUCCESSFUL') {
      let acc = 0;
      finishedMatches.data.reduce((_acc: number, match: IMatch) => {
        if (match.homeTeamId === teamId && match.homeTeamGoals === match.awayTeamGoals) {
          acc += 1;
        }
        return acc;
      }, acc);
      return acc;
    }
    return 0;
  }

  public static getTotalHomeLosses(teamId: number, finishedMatches: ServiceResponse<IMatch[]>) {
    if (finishedMatches.status === 'SUCCESSFUL') {
      let acc = 0;
      finishedMatches.data.reduce((_acc: number, match: IMatch) => {
        if (match.homeTeamId === teamId && match.homeTeamGoals < match.awayTeamGoals) {
          acc += 1;
        }
        return acc;
      }, acc);
      return acc;
    }
    return 0;
  }

  public static getTotalHomeGoalsFavor(teamId: number, finishedMatches: ServiceResponse<IMatch[]>) {
    if (finishedMatches.status === 'SUCCESSFUL') {
      let acc = 0;
      finishedMatches.data.reduce((_acc: number, match: IMatch) => {
        if (match.homeTeamId === teamId) {
          acc += match.homeTeamGoals;
        }
        return acc;
      }, acc);
      return acc;
    }
    return 0;
  }

  public static getTotalHomeGoalsOwn(teamId: number, finishedMatches: ServiceResponse<IMatch[]>) {
    if (finishedMatches.status === 'SUCCESSFUL') {
      let acc = 0;
      finishedMatches.data.reduce((_acc: number, match: IMatch) => {
        if (match.homeTeamId === teamId) {
          acc += match.awayTeamGoals;
        }
        return acc;
      }, acc);
      return acc;
    }
    return 0;
  }

  public static getTotalHomeGoalsBalance(
    teamId: number,
    finishedMatches: ServiceResponse<IMatch[]>,
  ) {
    if (finishedMatches.status === 'SUCCESSFUL') {
      let acc = 0;
      finishedMatches.data.reduce((_acc: number, match: IMatch) => {
        if (match.homeTeamId === teamId) {
          acc += match.homeTeamGoals;
          acc -= match.awayTeamGoals;
        }
        return acc;
      }, acc);
      return acc;
    }
    return 0;
  }

  public static getTeamHomeEfficiency(teamId: number, finishedMatches: ServiceResponse<IMatch[]>) {
    const totalPoints = LeaderboardHomeController.getTotalHomePoints(teamId, finishedMatches) ?? 0;
    const totalGames = LeaderboardHomeController.getTotalHomeGames(teamId, finishedMatches) ?? 0;

    const efficiency = (totalPoints / (totalGames * 3)) * 100;

    return efficiency.toFixed(2);
  }
}
