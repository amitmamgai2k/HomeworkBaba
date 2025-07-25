import asyncHandler from "../Helpers/AsyncHandler.js";
import uploadOnCloudinary from "../Helpers/cloudinary.js";
import { Assignment } from "../models/assignment.model.js";
import { User } from "../models/user.model.js";
import { validationResult } from "express-validator";
import { sendMessageToSocketId } from "../../socket.js";
import { getIO,sendMessageToUser } from "../../socket.js";
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
      description,
      socketId
    } = req.body;
    console.log("Socket ID:", socketId || "Not provided");


    console.log("Creating assignment with data:", req.body);


    // Validate required fields
    if(!uid || !fullName || !rollNumber || !assignmentTitle || !subjectName || !completionDate || !priority || !description || !socketId) {
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
        fileUrl = cloudinaryResponse.downloadUrl
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
    sendMessageToSocketId(socketId, {
  event: "assignmentCreated",
  data: {
    message: "🎉 New Assignment Successfull Created"
  },
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
export const getAssignments = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  const { status } = req.query;
  console.log("Fetching assignments for user:", uid, "with status:", status);

  try {
    // Validate required parameters
    if (!uid) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Validate status if provided (optional enhancement)
    if (status && !['pending', 'completed', 'overdue'].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be 'pending', 'completed', or 'overdue'"
      });
    }

    // Build query object
    const query = { uid };
    let responseMessage = "All assignments fetched successfully";

    if (status) {
      query.status = status;
      responseMessage = `Assignments with status '${status}' fetched successfully`;
    }

    // Fetch assignments
    const assignments = await Assignment.find(query).sort({ createdAt: -1 });

    // Handle empty results
    if (!assignments || assignments.length === 0) {
      return res.status(404).json({
        message: status
          ? `No assignments found with status '${status}' for this user`
          : "No assignments found for this user",
      });
    }

    // Successful response
    res.status(200).json({
      success: true,
      message: responseMessage,
      count: assignments.length,
      assignments: assignments,
    });

  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});
export const getAssignmentStatus = asyncHandler(async (req, res) => {
  const { uid } = req.params;

  if (!uid) {
    return res.status(400).json({
      message: "User ID is required",
    });
  }

  try {

    const assignments = await Assignment.find({ uid }, { status: 1 });


    let pending = 0;
    let completed = 0;
    let overdue = 0;


    assignments.forEach((assignment) => {
      switch (assignment.status) {
        case "pending":
          pending++;
          break;
        case "completed":
          completed++;
          break;
        case "overdue":
          overdue++;
          break;
        default:
          break;
      }
    });
    console.log("Assignment status for user:", uid, {
      pending,
      completed,
      overdue,
    });


    res.status(200).json({
      pending: pending,
      completed: completed,
      overdue: overdue,
      message: "Assignment status fetched successfully",


    });
  } catch (error) {
    console.error("Error fetching assignment status:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

export const deleteAssignment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "Assignment ID is required",
    });
  }

  try {
    const assignment = await Assignment.findByIdAndDelete(id);

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found",
      });
    }

    res.status(200).json({
      message: "Assignment deleted successfully",
      assignment: assignment,
    });

  } catch (error) {
    console.error("Error deleting assignment:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});
export const markAssignmentCompleted = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params; // Fixed typo: assignmenId -> assignmentId
  const { fileUrl } = req.body;

  console.log("Marking assignment completed:", assignmentId);

  const assignment = await Assignment.findById(assignmentId);
  if (!assignment || assignment.status === "completed") {
    return res.status(404).json({ message: "Assignment not found or already completed" });
  }

  // Update assignment
  assignment.status = "completed";
  assignment.responseFile = fileUrl;
  await assignment.save();

  console.log("Assignment updated, sending notification to user:", assignment.uid);

  // Send notification to user
  const notificationData = {
    id: Date.now(),
    title: "Assignment Completed",
    message: "🎉 Your assignment has been completed and is ready for download!",
    type: "assignment_completed",
    fileUrl: fileUrl,
    assignmentId: assignment._id,
    timestamp: new Date(),
    read: false
  };

  // Try to send notification
  const sent = sendMessageToUser(assignment.uid, "assignmentCompleted", notificationData);

  if (sent) {
    console.log(`Notification sent to user ${assignment.uid}`);
  } else {
    console.log(`User ${assignment.uid} is offline, you may want to store this notification`);
  }

  res.status(200).json({
    message: "Assignment marked complete and user notified",
    assignment,
    notificationSent: sent
  });
});