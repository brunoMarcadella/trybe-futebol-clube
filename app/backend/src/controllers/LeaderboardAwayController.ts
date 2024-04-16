import { Request, Response } from 'express';
import { ILeaderboard } from '../Interfaces/leaderboard/ILeaderboard';
import TeamService from '../services/TeamService';
import MatchService from '../services/MatchService';

export default class LeaderboardAwayController {
  constructor(
    private matchService = new MatchService(),
    private teamService = new TeamService(),
  ) { }

  public async getAwayLeaderboard(_req: Request, res: Response) {
    const teams = await this.teamService.getAllTeams();
    if (teams.status === 'SUCCESSFUL') {
      const leaderboardData = await Promise.all(
        teams.data.map(async (team) => ({
          name: team.teamName,
          ...await this.getAwayTeamStats(team.id),
        })),
      );
      const newLeaderboard = LeaderboardAwayController
        .sortLeaderboard(leaderboardData as ILeaderboard[]);
      res.status(200).json(newLeaderboard);
    }

    res.status(500).json({ message: 'Database Error' });
  }

  public async getAwayTeamStats(teamId: number) {
    const stats = {
      totalPoints: await this.getTotalAwayPoints(teamId),
      totalGames: await this.getTotalAwayGames(teamId),
      totalVictories: await this.getTotalAwayVictories(teamId),
      totalDraws: await this.getTotalAwayDraws(teamId),
      totalLosses: await this.getTotalAwayLosses(teamId),
      goalsFavor: await this.getTotalAwayGoalsFavor(teamId),
      goalsOwn: await this.getTotalAwayGoalsOwn(teamId),
      goalsBalance: await this.getTotalAwayGoalsBalance(teamId),
      efficiency: await this.getTeamAwayEfficiency(teamId),
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
      if (a.goalsFavor - a.goalsOwn !== b.goalsFavor - b.goalsOwn) {
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

  public async getTotalAwayPoints(teamId: number) {
    const finishedMatches = await this.matchService.getAllMatchesByFilter(false);
    if (finishedMatches.status === 'SUCCESSFUL') {
      let acc = 0;
      finishedMatches.data.reduce((_acc, match) => {
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
  }

  public async getTotalAwayGames(teamId: number) {
    const finishedMatches = await this.matchService.getAllMatchesByFilter(false);
    if (finishedMatches.status === 'SUCCESSFUL') {
      let acc = 0;
      finishedMatches.data.reduce((_acc, match) => {
        if (match.awayTeamId === teamId) {
          acc += 1;
        }

        return acc;
      }, acc);
      return acc;
    }
  }

  public async getTotalAwayVictories(teamId: number) {
    const finishedMatches = await this.matchService.getAllMatchesByFilter(false);
    if (finishedMatches.status === 'SUCCESSFUL') {
      let acc = 0;
      finishedMatches.data.reduce((_acc, match) => {
        if (match.awayTeamId === teamId && match.homeTeamGoals < match.awayTeamGoals) {
          acc += 1;
        }

        return acc;
      }, acc);

      return acc;
    }
  }

  public async getTotalAwayDraws(teamId: number) {
    const finishedMatches = await this.matchService.getAllMatchesByFilter(false);
    if (finishedMatches.status === 'SUCCESSFUL') {
      let acc = 0;
      finishedMatches.data.reduce((_acc, match) => {
        if (match.awayTeamId === teamId && match.homeTeamGoals === match.awayTeamGoals) {
          acc += 1;
        }

        return acc;
      }, acc);

      return acc;
    }
  }

  public async getTotalAwayLosses(teamId: number) {
    const finishedMatches = await this.matchService.getAllMatchesByFilter(false);
    if (finishedMatches.status === 'SUCCESSFUL') {
      let acc = 0;
      finishedMatches.data.reduce((_acc, match) => {
        if (match.awayTeamId === teamId && match.homeTeamGoals > match.awayTeamGoals) {
          acc += 1;
        }

        return acc;
      }, acc);

      return acc;
    }
  }

  public async getTotalAwayGoalsFavor(teamId: number) {
    const finishedMatches = await this.matchService.getAllMatchesByFilter(false);
    if (finishedMatches.status === 'SUCCESSFUL') {
      let acc = 0;
      finishedMatches.data.reduce((_acc, match) => {
        if (match.awayTeamId === teamId) {
          acc += match.awayTeamGoals;
        }

        return acc;
      }, acc);

      return acc;
    }
  }

  public async getTotalAwayGoalsOwn(teamId: number) {
    const finishedMatches = await this.matchService.getAllMatchesByFilter(false);
    if (finishedMatches.status === 'SUCCESSFUL') {
      let acc = 0;
      finishedMatches.data.reduce((_acc, match) => {
        if (match.awayTeamId === teamId) {
          acc += match.homeTeamGoals;
        }

        return acc;
      }, acc);

      return acc;
    }
  }

  public async getTotalAwayGoalsBalance(teamId: number) {
    const finishedMatches = await this.matchService.getAllMatchesByFilter(false);
    if (finishedMatches.status === 'SUCCESSFUL') {
      let acc = 0;
      finishedMatches.data.reduce((_acc, match) => {
        if (match.awayTeamId === teamId) {
          acc += match.awayTeamGoals;
          acc -= match.homeTeamGoals;
        }

        return acc;
      }, acc);

      return acc;
    }
  }

  public async getTeamAwayEfficiency(teamId: number) {
    const totalPoints = await this.getTotalAwayPoints(teamId) ?? 0;
    const totalGames = await this.getTotalAwayGames(teamId) ?? 0;

    const efficiency = (totalPoints / (totalGames * 3)) * 100;

    return efficiency.toFixed(2);
  }
}
