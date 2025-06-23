import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.error('❌ No file path provided');
      return null;
    }

    try {
      await fs.access(localFilePath);
    } catch (err) {
      console.error('❌ File not found:', localFilePath);
      return null;
    }

    const originalFilename = path.basename(localFilePath);
    const publicId = `assignment_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: 'HomeWorkBaba',
      resource_type: 'auto',
      public_id: publicId,
      use_filename: true,
      unique_filename: false
    });

    console.log('✅ File uploaded:', response.secure_url);

    await fs.unlink(localFilePath);
    console.log('🧹 Local file deleted:', localFilePath);

    const downloadUrl = response.secure_url
  .replace('/image/upload/', '/raw/upload/')
  .replace('/upload/', '/upload/fl_attachment/');

    return {
      previewUrl: response.secure_url,
      downloadUrl,
      publicId: response.public_id,
      resourceType: response.resource_type,
      format: response.format,
      originalFilename
    };

  } catch (error) {
    console.error('❌ Upload Error:', error.message);

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
