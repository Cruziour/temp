import jwt from 'jsonwebtoken';
import { ApiError, ApiResponse, asyncHandler } from '../utils/index.js';
import { User } from '../models/user.model.js';
import {
  generateOtp,
  hashOtp,
  sendOtpBySms,
  verifyOtp,
} from '../utils/otp-service/otp.services.js';
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from '../utils/cloudinary.js';

const generateAccessAndRefreshToken = async (user) => {
  if (!user) {
    throw new ApiError(404, 'Please provide user');
  }
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, 'Internal Server Error');
  }
};

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
  const data = `${phone}.${otp}.${expires}`;
  const hash = hashOtp(data);

  // send otp using phone number
  // await sendOtpBySms(phone, otp);

  res
    .status(200)
    .json(new ApiResponse(200, { hash, expires, phone, otp }, 'SuucessFully'));
});

const verifyReceiveOtp = asyncHandler(async (req, res) => {
  const { phone, otp, hash, expires } = req.body;

  // Validate required fields
  if (!otp || !hash || !phone || !expires) {
    throw new ApiError(400, 'Please provide all required fields');
  }

  // Check OTP expiration
  if (Date.now() > +expires) {
    throw new ApiError(400, 'OTP expired');
  }

  // Verify OTP
  const data = `${phone}.${otp}.${expires}`;
  const isValid = verifyOtp(hash, data);
  if (!isValid) {
    throw new ApiError(400, 'Invalid OTP');
  }

  // Find or create user
  let userData;
  try {
    userData = await User.findOne({ phone });
    if (!userData) {
      userData = await User.create({ phone });
    }
  } catch (error) {
    console.log(error);
    throw new ApiError(500, 'Error finding or creating user');
  }

  // Generate tokens
  const { accessToken, refreshToken } =
    await generateAccessAndRefreshToken(userData);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  // Remove refreshToken field before sending response
  const user = await User.findById(userData?._id).select(
    '-refreshToken -updatedAt -__v'
  );
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Send response
  return res
    .status(200)
    .cookie('refreshToken', refreshToken, options)
    .cookie('accessToken', accessToken, options)
    .json(
      new ApiResponse(
        200,
        { user, accessToken, refreshToken },
        'OTP verification successful'
      )
    );
});

const activateUser = asyncHandler(async (req, res) => {
  // activation logic
  const { name } = req.body;
  const avatarLocalPath = req.file?.path;

  if (!name || !avatarLocalPath) {
    throw new ApiError(400, 'Please provide name and avatar');
  }

  let avatar = null;
  try {
    // Upload avatar to cloud storage
    avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
      throw new ApiError(500, 'Error uploading avatar to cloudinary');
    }
  } catch (error) {
    throw new ApiError(500, 'Error uploading avatar to cloudinary');
  }

  try {
    // Activate user
    const user = await User.findOneAndUpdate(
      req.user?._id,
      {
        $set: {
          activated: true,
          name: name.trim(),
          avatar: avatar?.secure_url,
        },
      },
      { new: true }
    ).select('-refreshToken -updatedAt');
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { user, auth: true },
          'User activation successfully.'
        )
      );
  } catch (error) {
    await deleteFromCloudinary(avatar?.public_id);
    throw new ApiError(500, 'Error activating user');
  }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  let incomingRefreshToken;

  if (req.cookies?.refreshToken) {
    incomingRefreshToken = req.cookies.refreshToken;
  } else if (req.headers.authorization?.startsWith('Bearer ')) {
    incomingRefreshToken = req.headers.authorization.split(' ')[1];
  }

  if (!incomingRefreshToken) {
    throw new ApiError(401, 'Refresh token missing');
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESHTOKEN_SECRET_KEY
    );

    if (!decodedToken || !decodedToken._id) {
      throw new ApiError(402, 'Invalid refresh token');
    }

    const userInfo = await User.findById(decodedToken?._id);

    if (!userInfo) {
      throw new ApiError(404, 'User not found');
    }

    if (incomingRefreshToken !== userInfo?.refreshToken) {
      throw new ApiError(402, 'Refresh token mismatch');
    }

    // Generate new tokens
    const { accessToken, refreshToken } =
      await generateAccessAndRefreshToken(userInfo);

    const user = await User.findById(userInfo?._id).select(
      '-refreshToken -updatedAt'
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    };

    return res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { user, accessToken, refreshToken },
          'Access token refreshed successfully'
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message || 'Error refreshing access token');
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        refreshToken: null,
      },
    },
    {
      new: true,
    }
  );
  return res
    .status(200)
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .json(new ApiResponse(200, {user: null, auth: false}, 'User logged out successfully'));
});

export { sendOtp, verifyReceiveOtp, activateUser, refreshAccessToken, logoutUser };
