import asyncHandler from "../Helpers/AsyncHandler.js";
import uploadOnCloudinary from "../Helpers/cloudinary.js";
import { Assignment } from "../models/assignment.model.js";
import { User } from "../models/user.model.js";
import { validationResult } from "express-validator";

export const createAssignment = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  try {
    const {
      uid,
      fullName,
      rollNumber,
      assignmentTitle,
      subjectName,
      completionDate,
      priority,
      description
    } = req.body;
    console.log("Creating assignment with data:", req.body);

    if(!uid || !fullName || !rollNumber || !assignmentTitle || !subjectName || !completionDate || !priority || !description) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const file = req.file?.path;
    const fileSumbit = file ? await uploadOnCloudinary(file) : null;





    // Check if user exists first
    const userExists = await User.findOne({ uid: uid });
    if (!userExists) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const newAssignment = await Assignment.create({
      uid,
      fullName,
      rollNumber,
      assignmentTitle,
      subjectName,
      completionDate,
      priority,
      description,
      fileUrl:fileSumbit.url || null
    });



    res.status(201).json({
      message: "Assignment created successfully",
      assignment: newAssignment,
    });
  } catch (error) {
    console.error("Error creating assignment:", error);
    res.status(500).json({
      message: "Internal server mai error hai", // Fixed the message
      error: error.message, data:req.body
    });
  }
});