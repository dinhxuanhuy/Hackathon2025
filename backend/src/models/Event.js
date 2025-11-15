import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  EventID: {
    type: String,
  },
  RoomID: {
    type: String,
  },
  EventName: {
    type: String,
  },
  TimeStart: {
    type: Date,
  },
  TimeEnd: {
    type: Date,
  },
  Note: {
    type: String,
  },
});

const Event = mongoose.model("Event", eventSchema, "Events");

export default Event;
