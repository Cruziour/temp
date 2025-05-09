import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true
    },
    activated: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    }
  },
  { timestamps: true }
);

//Never use arrow function
userSchema.methods.generateAccessToken = function () {
  // short lived token
  return jwt.sign(
    {
      _id: this._id,
      phone: this.phone,
    },
    process.env.ACCESSTOKEN_SECRET_KEY,
    {
      expiresIn: process.env.ACCESSTOKEN_EXPIRE,
    }
  );
};

userSchema.methods.generateRefreshToken = function() {
  // long lived token
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESHTOKEN_SECRET_KEY,
    {
      expiresIn: process.env.REFRESHTOKEN_EXPIRE,
    }
  );
}

export const User = mongoose.model('User', userSchema);
