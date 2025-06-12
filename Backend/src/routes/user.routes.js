import express from 'express';
const router = express.Router();
import { body } from 'express-validator';
import { registerUser } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
router.post(
  '/register',[
   body('uid').notEmpty().withMessage('User ID is required'),
   body('email').isEmail().withMessage('Please enter a valid email address'),
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



