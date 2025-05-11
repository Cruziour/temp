import { Router } from 'express';
import verifyJwt from '../middlewares/auth.middleware.js';
import { createRoom, getAllExistingRoom } from '../controllers/room.controllers.js';

const router = Router();

router.route('/').post(verifyJwt, createRoom)
router.route('/fetch-room').post(verifyJwt, getAllExistingRoom);

export default router;
