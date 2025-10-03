import mongoose from "mongoose";

const jobFairSchema = new mongoose.Schema({
  title: { type: String, required: true },
  bannerImage: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("JobFair", jobFairSchema);
