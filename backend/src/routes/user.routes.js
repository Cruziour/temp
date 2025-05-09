import { Router } from 'express';
import { sendOtp, verifyReceiveOtp } from '../controllers/auth.controllers.js';

const router = Router();

router.route('/send-otp').post(sendOtp);
router.route('/verify-otp').post(verifyReceiveOtp);

export default router;
