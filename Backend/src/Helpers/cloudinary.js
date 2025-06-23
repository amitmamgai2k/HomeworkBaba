import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';

// Setup Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload function
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.error('❌ No file path provided');
      return null;
    }

    // Ensure the file exists
    try {
      await fs.access(localFilePath);
    } catch (err) {
      console.error('❌ File not found:', localFilePath);
      return null;
    }

    // Upload using resource_type: 'auto' for all file types
    const publicId = `assignment_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: 'HomeWorkBaba',
      resource_type: 'auto',
      public_id: publicId
    });

    console.log('✅ File uploaded:', response.secure_url);

    // Delete local file after upload
    await fs.unlink(localFilePath);
    console.log('🧹 Local file deleted:', localFilePath);

    // Create a forced download link
    const downloadUrl = response.secure_url.replace('/upload/', `/upload/fl_attachment:${publicId}.pdf/`);

    return {
      previewUrl: response.secure_url, // for previewing (PDF opens in browser)
      downloadUrl                       // for downloading directly
    };

  } catch (error) {
    console.error('❌ Upload Error:', error.message);

    // Clean up local file if upload failed
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
