import JobFair from "../models/jobFairSchema.js";
import User from "../models/userSchema.js";
import ServiceRequest from "../models/serviceSchema.js";
import cloudinary from "cloudinary";

// Create Job Fair (upload banner to Cloudinary)
export const createJobFair = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;

    if (!req.files?.bannerImage) {
      return res.status(400).json({ success: false, message: "Banner image is required" });
    }

    const upload = await cloudinary.v2.uploader.upload(req.files.bannerImage.tempFilePath, { folder: "skillconnect/jobfairs" });

    const jobfair = await JobFair.create({
      title,
      description,
      date,
      location,
      bannerImage: upload.secure_url,
    });

    res.status(201).json({ success: true, jobfair });
  } catch (err) {
    console.error("createJobFair error", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all service requests
export const adminGetAllServiceRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find()
      .populate("user", "username email role")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: requests.length, requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Verify user
export const verifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.verified) return res.status(400).json({ success: false, message: "User is already verified" });

    user.verified = true;
    await user.save();

    res.json({ success: true, message: "User verified successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get verified service providers
export const getServiceProviders = async (req, res) => {
  try {
    const workers = await User.find({ role: "Service Provider", verified: true })
      .select("firstName lastName skills availability profilePic createdAt");
    res.json({ success: true, count: workers.length, workers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
