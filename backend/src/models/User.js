// backend/src/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  UserID: {
    type: String,
    required: true,
    unique: true,
  },
  UserPassword: {
    type: String,
    required: true,
  },
  Role: {
    type: String,
    enum: ["Student", "Admin"],
    default: "Student",
  },
  UserName: {
    type: String,
  },
  EndTimeGiuXe: {
    type: Date,
  },
  StartTimeGiuXe: {
    type: Date,
  },
  TotalFare: {
    type: Number,
  },
});

const User = mongoose.model("User", userSchema, "Users");

export default User;