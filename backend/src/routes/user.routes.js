import { Router } from 'express';
import verifyJwt from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import {
  activateUser,
  logoutUser,
  refreshAccessToken,
  sendOtp,
  verifyReceiveOtp,
} from '../controllers/auth.controllers.js';

const router = Router();

// unsecure routes
router.route('/send-otp').post(sendOtp);
router.route('/verify-otp').post(verifyReceiveOtp);
router.route('/refresh-token').get(refreshAccessToken)

//secure routes
router
  .route('/activate')
  .post(verifyJwt, upload.single('avatar'), activateUser);

router.route('/logout-user').post(verifyJwt, logoutUser)

export default router;
