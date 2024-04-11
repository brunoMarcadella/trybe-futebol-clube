import { Request, Router, Response } from 'express';
import UserController from '../controllers/UserController';
import Validations from '../middlewares/Validations';

const userController = new UserController();

const router = Router();

// router.get('/', (req: Request, res: Response) => teamController.getAllTeams(req, res));
// router.get('/:id', (req: Request, res: Response) => teamController.getTeamById(req, res));

export default router;
