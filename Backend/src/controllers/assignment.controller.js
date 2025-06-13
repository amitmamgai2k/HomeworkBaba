import asyncHandler from "../Helpers/AsyncHandler";
import { Assignment } from "../models/assignment.model";
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
    const { uid,fullName, rollNumber, assignmentTitle, subjectName, completionDate, priority, description } = req.body;
    const fileUrl = req.file ? req.file.path : null;

    const newAssignment = new Assignment({
      uid,
      fullName,
      rollNumber,
      assignmentTitle,
      subjectName,
      completionDate,
      priority,
      description,
      fileUrl,
    });



     const userExists = await User.findById(uid);
    if (!userExists) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await newAssignment.save();

    res.status(201).json({
      message: "Assignment created successfully",
      assignment: newAssignment,
    });
  } catch (error) {
    console.error("Error creating assignment:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}
);
