import User from "../models/userSchema.js";
import JobFair from "../models/jobFairSchema.js";

export const getSkilledUsers = async (req, res) => {
  try {
    const workers = await User.find({ role: "Service Provider", verified: true })
      .select("firstName lastName skills availability profilePic createdAt");
    res.json({ success: true, count: workers.length, workers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getJobFair = async (req, res) => {
  try {
    const jobfair = await JobFair.findOne().sort({ createdAt: -1 });
    if (!jobfair) return res.status(404).json({ success: false, message: "No job fair found" });
    res.json({ success: true, jobfair });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
