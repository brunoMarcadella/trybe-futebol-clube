import { Request, Response } from 'express';
import { ILeaderboard } from '../Interfaces/leaderboard/ILeaderboard';
import LeaderboardHomeController from './LeaderboardHomeController';
import LeaderboardAwayController from './LeaderboardAwayController';
import TeamService from '../services/TeamService';

export default class LeaderboardController {
  constructor(
    private teamService = new TeamService(),
    private leaderboardHomeController = new LeaderboardHomeController(),
    private leaderboardAwayController = new LeaderboardAwayController(),
  ) { }

  public async getLeaderboard(_req: Request, res: Response) {
    const teams = await this.teamService.getAllTeams();
    if (teams.status === 'SUCCESSFUL') {
      const leaderboardData = await Promise.all(
        teams.data.map(async (team) => ({
          name: team.teamName,
          ...await this.getTeamStats(team.id),
        })),
      );
      const newLeaderboard = LeaderboardController
        .sortLeaderboard(leaderboardData as ILeaderboard[]);
      res.status(200).json(newLeaderboard);
    }

    res.status(500).json({ message: 'Database Error' });
  }

  public async getTeamStats(teamId: number) {
    const stats = {
      totalPoints: await this.getTotalPoints(teamId),
      totalGames: await this.getTotalGames(teamId),
      totalVictories: await this.getTotalVictories(teamId),
      totalDraws: await this.getTotalDraws(teamId),
      totalLosses: await this.getTotalLosses(teamId),
      goalsFavor: await this.getTotalGoalsFavor(teamId),
      goalsOwn: await this.getTotalGoalsOwn(teamId),
      goalsBalance: await this.getTotalGoalsBalance(teamId),
      efficiency: await this.getTeamEfficiency(teamId),
    };

    return stats;
  }

  static sortLeaderboard(leaderboard: ILeaderboard[]) {
    const newLeaderboard = leaderboard.sort((a, b) => {
      if (a.totalPoints !== b.totalPoints) {
        return LeaderboardController.sortByPoints(a, b);
      }
      if (a.totalVictories !== b.totalVictories) {
        return LeaderboardController.sortByVictories(a, b);
      }
      if (a.goalsBalance !== b.goalsBalance) {
        return LeaderboardController.sortByGoalsBalance(a, b);
      }
      return LeaderboardController.sortByScoredGoals(a, b);
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

  public async getTotalPoints(teamId: number) {
    const homeStats = await this.leaderboardHomeController.getHomeTeamStats(teamId);
    const awayStats = await this.leaderboardAwayController.getAwayTeamStats(teamId);
    return homeStats.totalPoints + awayStats.totalPoints;
  }

  public async getTotalGames(teamId: number) {
    const homeStats = await this.leaderboardHomeController.getHomeTeamStats(teamId);
    const awayStats = await this.leaderboardAwayController.getAwayTeamStats(teamId);
    return homeStats.totalGames + awayStats.totalGames;
  }

  public async getTotalVictories(teamId: number) {
    const homeStats = await this.leaderboardHomeController.getHomeTeamStats(teamId);
    const awayStats = await this.leaderboardAwayController.getAwayTeamStats(teamId);
    return homeStats.totalVictories + awayStats.totalVictories;
  }

  public async getTotalDraws(teamId: number) {
    const homeStats = await this.leaderboardHomeController.getHomeTeamStats(teamId);
    const awayStats = await this.leaderboardAwayController.getAwayTeamStats(teamId);
    return homeStats.totalDraws + awayStats.totalDraws;
  }

  public async getTotalLosses(teamId: number) {
    const homeStats = await this.leaderboardHomeController.getHomeTeamStats(teamId);
    const awayStats = await this.leaderboardAwayController.getAwayTeamStats(teamId);
    return homeStats.totalLosses + awayStats.totalLosses;
  }

  public async getTotalGoalsFavor(teamId: number) {
    const homeStats = await this.leaderboardHomeController.getHomeTeamStats(teamId);
    const awayStats = await this.leaderboardAwayController.getAwayTeamStats(teamId);
    return homeStats.goalsFavor + awayStats.goalsFavor;
  }

  public async getTotalGoalsOwn(teamId: number) {
    const homeStats = await this.leaderboardHomeController.getHomeTeamStats(teamId);
    const awayStats = await this.leaderboardAwayController.getAwayTeamStats(teamId);
    return homeStats.goalsOwn + awayStats.goalsOwn;
  }

  public async getTotalGoalsBalance(teamId: number) {
    const homeStats = await this.leaderboardHomeController.getHomeTeamStats(teamId);
    const awayStats = await this.leaderboardAwayController.getAwayTeamStats(teamId);
    return homeStats.goalsBalance + awayStats.goalsBalance;
  }

  public async getTeamEfficiency(teamId: number) {
    const totalPoints = await this.getTotalPoints(teamId) ?? 0;
    const totalGames = await this.getTotalGames(teamId) ?? 0;

    const efficiency = (totalPoints / (totalGames * 3)) * 100;

    return efficiency.toFixed(2);
  }
}
