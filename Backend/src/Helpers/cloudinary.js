import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.error('No file path provided');
      return null;
    }

    // Check if file exists
    try {
      await fs.access(localFilePath);
    } catch (error) {
      console.error('File does not exist:', localFilePath);
      return null;
    }

    // Determine the file extension
    const fileExt = localFilePath.split('.').pop().toLowerCase();

    // Decide resource_type based on extension
    const resourceType = ['pdf', 'doc', 'docx', 'txt'].includes(fileExt) ? 'raw' : 'image';

    console.log(`Uploading ${resourceType} file to Cloudinary:`, localFilePath);

    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: 'HomeWorkBaba',
      resource_type: resourceType,
      // Add public_id for better file management
      public_id: `assignment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    });

    console.log('File uploaded successfully to Cloudinary:', response.secure_url);

    // Remove local file after successful upload
    await fs.unlink(localFilePath);
    console.log('Local file removed:', localFilePath);

    return response;

  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);

    // Try to remove local file even if upload failed
    try {
      await fs.access(localFilePath);
      await fs.unlink(localFilePath);
      console.log('Local file removed after error:', localFilePath);
    } catch (unlinkError) {
      console.error('Error removing local file:', unlinkError);
    }

    return null;
  }
};

export default uploadOnCloudinary;