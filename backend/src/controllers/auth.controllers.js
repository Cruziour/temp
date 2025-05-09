import { ApiError, ApiResponse, asyncHandler } from '../utils/index.js';
import { generateOtp, hashOtp } from '../utils/otp-service/otp.services.js';

const sendOtp = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    throw new ApiError(400, 'Please provide phone number');
  }
  //generate otp
  const otp = await generateOtp();

  //Hash otp
  const ttl = 1000 * 60 * 2; // 2 min
  const expires = Date.now() + ttl;
  const data = `${phone}.${otp}.${expires}`
  const hash = hashOtp(data);

  res.status(200).json(new ApiResponse(200, {hash}, 'SuucessFully'));
});

export { sendOtp };
