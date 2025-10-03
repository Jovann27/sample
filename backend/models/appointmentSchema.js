import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  service: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  address: { type: String, required: true },
  notes: { type: String },
  fee: { type: Number, default: 0 },
  status: { type: String, enum: ["Pending", "Working", "Completed", "Cancelled"], default: "Pending" },
  serviceProvider: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.model("Appointment", appointmentSchema);
