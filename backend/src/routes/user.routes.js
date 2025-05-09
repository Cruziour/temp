import { Router } from 'express'
import { sendOtp } from '../controllers/auth.controllers.js'

const router = Router()

router.route('/send-otp').post(sendOtp)

export default router;