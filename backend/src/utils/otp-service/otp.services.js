import crypto from 'crypto';

const generateOtp = async () => {
  const otp = crypto.randomInt(1000, 9999);
  return otp;
};

const hashOtp = (data) => {
  return crypto
    .createHmac('sha256', process.env.HASH_SECRET)
    .update(data)
    .digest('hex');
};

const sendOtpBySms = () => {};

const verifyOtp = () => {};

const sendOtpByEmail = () => {};

export { generateOtp, sendOtpBySms, verifyOtp, sendOtpByEmail, hashOtp };
