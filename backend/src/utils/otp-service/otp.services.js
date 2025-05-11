import crypto from 'crypto';
import dotenv from 'dotenv';
import twilio from 'twilio';

dotenv.config();

const smsSid = process.env.SMS_SID;
const smsAuthToken = process.env.SMS_AUTH_TOKEN;

const client = twilio(smsSid, smsAuthToken, {
  lazyLoading: true,
});

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

const sendOtpBySms = async (phone, otp) => {
  try {
    const message = await client.messages.create({
      to: phone,
      from: process.env.SMS_FORM_NUMBER,
      body: `Your CodersHouse OTP is ${otp}`,
    });
    // console.log(`OTP sent to ${phone}`);
    // return message.sid;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

const verifyOtp = (hashedOtp, data) => {
  let computedHash = hashOtp(data);
  if (hashedOtp === computedHash) {
    return true;
  }
  return false;
};

const sendOtpByEmail = () => {};

export { generateOtp, sendOtpBySms, verifyOtp, sendOtpByEmail, hashOtp };
