import mongoose from "mongoose";
const assignmentSchema = new mongoose.Schema({
    fullName: {
    type: String,
    required: true,
  },
  RollNumber:{
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },
  Subjectname: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  dueDate: {
    type: Date,
    required: true,
  },

},{
  timestamps: true,
});
const Assignment = mongoose.model("Assignment", assignmentSchema);
export default Assignment;