import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { ApiError, asyncHandler } from '../utils/index.js';

const verifyJwt = asyncHandler(async (req, res, next) => {
  let token;

  // Try from cookies first
  if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }
  // Else, try from Authorization header
  else if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(
      401,
      'Token not provided in cookies or Authorization header'
    );
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESSTOKEN_SECRET_KEY);

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, 'Provided token is invalid');
  }
});

export default verifyJwt;
