import { Request, Response } from 'express';
import { ServiceResponse } from '../Interfaces/ServiceResponse';
import { IMatch } from '../Interfaces/matches/IMatch';
import { ILeaderboard } from '../Interfaces/leaderboard/ILeaderboard';
import LeaderboardHomeController from './LeaderboardHomeController';
import LeaderboardAwayController from './LeaderboardAwayController';
import TeamService from '../services/TeamService';
import MatchService from '../services/MatchService';

export default class LeaderboardController {
  private teamService = new TeamService();
  private matchService = new MatchService();

  public async getLeaderboard(_req: Request, res: Response) {
    const teams = await this.teamService.getAllTeams();
    const finishedMatches = await this.matchService.getAllMatchesByFilter(false);
    if (teams.status === 'SUCCESSFUL') {
      const leaderboardData = await Promise.all(
        teams.data.map(async (team) => ({
          name: team.teamName,
          ...LeaderboardController.getTeamStats(team.id, finishedMatches),
        })),
      );
      const newLeaderboard = LeaderboardController
        .sortLeaderboard(leaderboardData as ILeaderboard[]);
      res.status(200).json(newLeaderboard);
    } else {
      res.status(500).json({ message: 'Database Error' });
    }
  }

  static getTeamStats(teamId: number, finishedMatches: ServiceResponse<IMatch[]>) {
    const homeStats = LeaderboardHomeController.getHomeTeamStats(teamId, finishedMatches);
    const awayStats = LeaderboardAwayController.getAwayTeamStats(teamId, finishedMatches);
    const stats = {
      totalPoints: homeStats.totalPoints + awayStats.totalPoints,
      totalGames: homeStats.totalGames + awayStats.totalGames,
      totalVictories: homeStats.totalVictories + awayStats.totalVictories,
      totalDraws: homeStats.totalDraws + awayStats.totalDraws,
      totalLosses: homeStats.totalLosses + awayStats.totalLosses,
      goalsFavor: homeStats.goalsFavor + awayStats.goalsFavor,
      goalsOwn: homeStats.goalsOwn + awayStats.goalsOwn,
      goalsBalance: homeStats.goalsBalance + awayStats.goalsBalance,
      efficiency: LeaderboardController.getTeamEfficiency(teamId, finishedMatches),
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

  static getTeamEfficiency(teamId: number, finishedMatches: ServiceResponse<IMatch[]>) {
    const homeStats = LeaderboardHomeController.getHomeTeamStats(teamId, finishedMatches);
    const awayStats = LeaderboardAwayController.getAwayTeamStats(teamId, finishedMatches);
    const totalPoints = homeStats.totalPoints + awayStats.totalPoints;
    const totalGames = homeStats.totalGames + awayStats.totalGames;

    const efficiency = (totalPoints / (totalGames * 3)) * 100;

    return efficiency.toFixed(2);
  }
}
