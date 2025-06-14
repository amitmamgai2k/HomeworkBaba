

import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    uid: {
    type: String,
    required: true,  // UID of the user this assignment belongs to
    ref: "User",     // Optional: enables population if needed
  },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    rollNumber: {
      type: String,
      required: true,
      trim: true,
    },
    assignmentTitle: {
      type: String,
      required: true,
      trim: true,
    },
    subjectName: {
      type: String,
      required: true,
      trim: true,
    },
    completionDate: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
    description: {
      type: String,
      trim: true,
    },
    // fileUrl: {
    //   type: String,
    // },
  },
  {
    timestamps: true,
  }
);

export const Assignment = mongoose.model("Assignment", assignmentSchema);
