import { Request, Response } from 'express';
import { ILeaderboard } from '../Interfaces/leaderboard/ILeaderboard';
import TeamService from '../services/TeamService';
import MatchService from '../services/MatchService';

export default class LeaderboardHomeController {
  constructor(
    private matchService = new MatchService(),
    private teamService = new TeamService(),
  ) { }

  public async getHomeLeaderboard(_req: Request, res: Response) {
    const teams = await this.teamService.getAllTeams();
    if (teams.status === 'SUCCESSFUL') {
      const leaderboardData = await Promise.all(
        teams.data.map(async (team) => ({
          name: team.teamName,
          ...await this.getHomeTeamStats(team.id),
        })),
      );
      const newLeaderboard = LeaderboardHomeController
        .sortLeaderboard(leaderboardData as ILeaderboard[]);
      res.status(200).json(newLeaderboard);
    }
    res.status(500).json({ message: 'Database Error' });
  }

  public async getHomeTeamStats(teamId: number) {
    const stats = {
      totalPoints: await this.getTotalHomePoints(teamId),
      totalGames: await this.getTotalHomeGames(teamId),
      totalVictories: await this.getTotalHomeVictories(teamId),
      totalDraws: await this.getTotalHomeDraws(teamId),
      totalLosses: await this.getTotalHomeLosses(teamId),
      goalsFavor: await this.getTotalHomeGoalsFavor(teamId),
      goalsOwn: await this.getTotalHomeGoalsOwn(teamId),
      goalsBalance: await this.getTotalHomeGoalsBalance(teamId),
      efficiency: await this.getTeamHomeEfficiency(teamId),
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

  public async getTotalHomePoints(teamId: number): Promise<number> {
    const finishedMatches = await this.matchService.getAllMatchesByFilter(false);
    if (finishedMatches.status === 'SUCCESSFUL') {
      let acc = 0;
      finishedMatches.data.reduce((_acc, match) => {
        if (match.homeTeamId === teamId) {
          if (match.homeTeamGoals > match.awayTeamGoals) {
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

  public async getTotalHomeGames(teamId: number) {
    const finishedMatches = await this.matchService.getAllMatchesByFilter(false);
    if (finishedMatches.status === 'SUCCESSFUL') {
      let acc = 0;
      finishedMatches.data.reduce((_acc, match) => {
        if (match.homeTeamId === teamId) {
          acc += 1;
        }
        return acc;
      }, acc);
      return acc;
    }
    return 0;
  }

  public async getTotalHomeVictories(teamId: number) {
    const finishedMatches = await this.matchService.getAllMatchesByFilter(false);
    if (finishedMatches.status === 'SUCCESSFUL') {
      let acc = 0;
      finishedMatches.data.reduce((_acc, match) => {
        if (match.homeTeamId === teamId && match.homeTeamGoals > match.awayTeamGoals) {
          acc += 1;
        }
        return acc;
      }, acc);
      return acc;
    }
    return 0;
  }

  public async getTotalHomeDraws(teamId: number) {
    const finishedMatches = await this.matchService.getAllMatchesByFilter(false);
    if (finishedMatches.status === 'SUCCESSFUL') {
      let acc = 0;
      finishedMatches.data.reduce((_acc, match) => {
        if (match.homeTeamId === teamId && match.homeTeamGoals === match.awayTeamGoals) {
          acc += 1;
        }
        return acc;
      }, acc);
      return acc;
    }
    return 0;
  }

  public async getTotalHomeLosses(teamId: number) {
    const finishedMatches = await this.matchService.getAllMatchesByFilter(false);
    if (finishedMatches.status === 'SUCCESSFUL') {
      let acc = 0;
      finishedMatches.data.reduce((_acc, match) => {
        if (match.homeTeamId === teamId && match.homeTeamGoals < match.awayTeamGoals) {
          acc += 1;
        }
        return acc;
      }, acc);
      return acc;
    }
    return 0;
  }

  public async getTotalHomeGoalsFavor(teamId: number) {
    const finishedMatches = await this.matchService.getAllMatchesByFilter(false);
    if (finishedMatches.status === 'SUCCESSFUL') {
      let acc = 0;
      finishedMatches.data.reduce((_acc, match) => {
        if (match.homeTeamId === teamId) {
          acc += match.homeTeamGoals;
        }
        return acc;
      }, acc);
      return acc;
    }
    return 0;
  }

  public async getTotalHomeGoalsOwn(teamId: number) {
    const finishedMatches = await this.matchService.getAllMatchesByFilter(false);
    if (finishedMatches.status === 'SUCCESSFUL') {
      let acc = 0;
      finishedMatches.data.reduce((_acc, match) => {
        if (match.homeTeamId === teamId) {
          acc += match.awayTeamGoals;
        }
        return acc;
      }, acc);
      return acc;
    }
    return 0;
  }

  public async getTotalHomeGoalsBalance(teamId: number) {
    const finishedMatches = await this.matchService.getAllMatchesByFilter(false);
    if (finishedMatches.status === 'SUCCESSFUL') {
      let acc = 0;
      finishedMatches.data.reduce((_acc, match) => {
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

  public async getTeamHomeEfficiency(teamId: number) {
    const totalPoints = await this.getTotalHomePoints(teamId) ?? 0;
    const totalGames = await this.getTotalHomeGames(teamId) ?? 0;

    const efficiency = (totalPoints / (totalGames * 3)) * 100;

    return efficiency.toFixed(2);
  }
}
