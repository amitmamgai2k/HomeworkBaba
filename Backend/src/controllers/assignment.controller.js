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
    console.log("File received:", req.file);

    // Validate required fields
    if(!uid || !fullName || !rollNumber || !assignmentTitle || !subjectName || !completionDate || !priority || !description) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    // Check if user exists first
    const userExists = await User.findOne({ uid: uid });
    if (!userExists) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Handle file upload if file exists
    let fileUrl = null;
    if (req.file?.path) {
      console.log("Uploading file to Cloudinary...");
      const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

      if (cloudinaryResponse) {
        fileUrl = cloudinaryResponse.secure_url;
        console.log("File uploaded successfully:", fileUrl);
      } else {
        console.log("File upload failed");
      }
    }

    // Create assignment
    const newAssignment = await Assignment.create({
      uid,
      fullName,
      rollNumber,
      assignmentTitle,
      subjectName,
      completionDate: new Date(completionDate),
      priority,
      description,
      fileUrl: fileUrl
    });

    res.status(201).json({
      message: "Assignment created successfully",
      assignment: newAssignment,
    });

  } catch (error) {
    console.error("Error creating assignment:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      data: req.body
    });
  }
});