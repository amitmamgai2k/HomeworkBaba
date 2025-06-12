import asyncHandler from "../Helpers/AsyncHandler.js";
import { validationResult } from "express-validator";
import { User} from "../models/user.model.js"

export const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  const { uid, email, name, gender, schoolName, major, dob, phone, profileImage } = req.body;

  const existingUser = await User.findOne({ uid });
  if (existingUser) {
    return res.status(200).json({
      message: "User already registered",
      user: existingUser,
    });
  }

  const newUser = new User({ uid, email, name, gender, schoolName, major, dob, phone, profileImage });

  await newUser.save();

  res.status(201).json({
    message: "User registered successfully",
    user: newUser,
  });
});
