import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, uniquie: true },
  email: { type: String, required: true, uniquie: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

export default User;
