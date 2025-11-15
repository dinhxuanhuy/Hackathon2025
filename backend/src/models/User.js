import mongoose from "mongoose";

const User = mongoose.model("User", {}, "Users");

export default User;
