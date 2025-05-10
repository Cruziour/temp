import { Router } from 'express';
import verifyJwt from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import {
  activateUser,
  sendOtp,
  verifyReceiveOtp,
} from '../controllers/auth.controllers.js';

const router = Router();

// unsecure routes
router.route('/send-otp').post(sendOtp);
router.route('/verify-otp').post(verifyReceiveOtp);

//secure routes
router
  .route('/activate')
  .post(verifyJwt, upload.single('avatar'), activateUser);

export default router;
