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

    // Determine the file extension
    const fileExt = localFilePath.split('.').pop().toLowerCase();

    // Decide resource_type based on extension
    const resourceType = (fileExt === 'pdf' || fileExt === 'doc' || fileExt === 'txt') ? 'raw' : 'image';

    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: 'HomeWorkBaba',
      resource_type: resourceType

    });

    console.log('File is uploaded on Cloudinary:', response.secure_url);

    await fs.rm(localFilePath);
    console.log('Local file removed:', localFilePath);

    return response;
  } catch (error) {
    console.error('Error uploading file:', error);
    try {
      if (await fs.stat(localFilePath)) {
        await fs.rm(localFilePath);
        console.log('Local file removed after error:', localFilePath);
      }
    } catch (unlinkError) {
      console.error('Error removing local file:', unlinkError);
    }

    return null;
  }
};

export default uploadOnCloudinary;
