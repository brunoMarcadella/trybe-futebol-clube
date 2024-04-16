import { Request, Router, Response } from 'express';
import LeaderboardHomeController from '../controllers/LeaderboardHomeController';
import LeaderboardAwayController from '../controllers/LeaderboardAwayController';

const leaderboardHomeController = new LeaderboardHomeController();
const leaderboardAwayController = new LeaderboardAwayController();

const router = Router();

router.get(
  '/home',
  (req: Request, res: Response) => leaderboardHomeController.getHomeLeaderboard(req, res),
);
router.get(
  '/away',
  (req: Request, res: Response) => leaderboardAwayController.getAwayLeaderboard(req, res),
);

export default router;
