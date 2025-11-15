// backend/src/models/User.js
import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  UserID: {
    type: String,
    required: true,
    unique: true,
  },
});

const Schedule = mongoose.model("Schedule", scheduleSchema, "Schedule");

export default Schedule;
