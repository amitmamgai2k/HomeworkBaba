import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender:{
    type: String,
    enum: ["male","female","other"],
    default: "male",
  },
  profilImage:{
    type: String,
    default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-978409_960_720.png",
  },
  school:{
    type: String,
    required: true,
  },
  stream:{
    type: String,

  },
    dob:{
        type: Date,
        required: true,
    },


  phoneNumber: {
    type: String,
    required: true,
  },
});
const User = mongoose.model("User", userSchema);
export default User;