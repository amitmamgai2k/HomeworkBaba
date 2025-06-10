import express from 'express';
const router = express.Router();
import { body } from 'express-validator';
import { registerUser } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
router.post(
  '/register',
  upload.single('profilePicture'), // Assuming the field name is 'profilePicture'
  [
   body('name').notEmpty().withMessage('Name is required'),
   body('gender').notEmpty().withMessage('Gender is required'),
   body('schoolName').notEmpty().withMessage('School name is required'),
   body('major').notEmpty().withMessage('Stream is required'),
   body('dob').notEmpty().withMessage('Date of birth is required'),
   body('phone').notEmpty().withMessage('Phone number is required'),

  ],
  registerUser
);
export default router;



