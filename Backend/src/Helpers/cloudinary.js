import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';

// Cloudinary config from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Main upload function
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.error('❌ No file path provided');
      return null;
    }

    // Check if file exists before upload
    try {
      await fs.access(localFilePath);
    } catch (err) {
      console.error('❌ File not found:', localFilePath);
      return null;
    }

    // Use auto resource type for all file types
    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: 'HomeWorkBaba',
      resource_type: 'auto',
      public_id: `assignment_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    });

    console.log('✅ File uploaded:', response.secure_url);

    // Remove local file after upload
    await fs.unlink(localFilePath);
    console.log('🧹 Local file removed:', localFilePath);

    return response;

  } catch (error) {
    console.error('❌ Cloudinary Upload Error:', error.message);

    // Clean up local file if error happens
    try {
      await fs.access(localFilePath);
      await fs.unlink(localFilePath);
      console.log('🧹 Local file cleaned after error');
    } catch (unlinkErr) {
      console.error('❌ Failed to remove local file:', unlinkErr.message);
    }

    return null;
  }
};

export default uploadOnCloudinary;
