import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minLength: 3, maxLength: 20 },
  firstName: { type: String, required: true, trim: true, minLength: 2, maxLength: 30 },
  lastName: { type: String, required: true, trim: true, minLength: 2, maxLength: 30 },
  email: { type: String, required: true, unique: true, lowercase: true, validate: [validator.isEmail, "Invalid email"] },
  phone: { type: String, required: true },
  otherContact: { type: String, default: "" },
  address: { type: String, required: true },
  birthdate: { type: Date, required: true },
  occupation: { type: String, default: "" },
  employed: { type: String, required: true },
  skills: { type: [String], default: [] },
  certificates: { type: [String], default: [] },
  validId: { type: String, required: true },
  profilePic: { type: String, default: "" },
  password: { type: String, required: true, minLength: 8, select: false },
  role: { type: String, enum: ["Service Provider", "Community Member", "Business Owner"], default: "Community Member" },
  availability: { type: String, enum: ["Available", "Currently Working", "Not Available"], default: "Not Available" },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Hash password
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getJWTToken = function() {
  return jwt.sign({ id: this._id, role: this.role, type: "user" }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE });
};

export default mongoose.model("User", userSchema);
