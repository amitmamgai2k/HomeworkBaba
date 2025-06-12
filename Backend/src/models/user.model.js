import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: String,
  name: String,
  gender: String,
  schoolName: String,
  major: String,
  phone: String,
  dob: String,
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export { User };