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
    const { uid,fullName, rollNumber, assignmentTitle, subjectName, completionDate, priority, description } = req.body;
  //  const file = req.file?.path;
  //   const fileSumbit = await uploadOnCloudinary(file);
  //   if (!fileSumbit) {
  //     return res.status(400).json({ error: "Error uploading file" });
  //   }



    const newAssignment = new Assignment({
      uid,
      fullName,
      rollNumber,
      assignmentTitle,
      subjectName,
      completionDate,
      priority,
      description,
      // fileUrl: fileSumbit.secure_url,

    });



     const userExists = await User.findOne({ uid: uid });
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
