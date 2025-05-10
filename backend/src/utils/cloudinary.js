import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';
import { ApiError } from './index.js';

dotenv.config({});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localPath) => {
  try {
    if (!localPath) {
      throw new ApiError(400, 'Local file path is required for upload');
    }
    const response = await cloudinary.uploader.upload(localPath, {
      resource_type: 'auto',
    });
    fs.unlinkSync(localPath);
    if (!response) {
      throw new ApiError(500, 'Failed to upload file to Cloudinary');
    }
    return response;
  } catch (error) {
    fs.unlinkSync(localPath);
    throw new ApiError(500, 'Cloudinary upload failed');
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    console.log('Public ID:', publicId);

    if (!publicId) {
      throw new ApiError(400, 'Public ID is required for deletion');
    }

    const response = await cloudinary.uploader.destroy(publicId);
    console.log('Cloudinary delete response:', response);

    if (response.result !== 'ok') {
      throw new ApiError(500, 'Failed to delete file from Cloudinary');
    }

    return response;
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    throw new ApiError(500, 'Cloudinary deletion failed');
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
