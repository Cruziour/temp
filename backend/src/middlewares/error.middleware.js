import mongoose from 'mongoose';
import { ApiError } from '../utils/index.js';

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode
      ? error.statusCode
      : error instanceof mongoose.Error
        ? 400
        : 500;
    const message = error.message || 'Unknown error occurred';
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  const response = {
    ...error,
    message: error.message || 'Unknown error occurred',
    ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {}),
  };

  return res.status(error.statusCode || 500).json(response);
};

export default errorHandler;
