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
    const { skill, status, sort } = req.query;

  let filter = {};
    if (skill) {
      // build a case-insensitive regex for partial matching
      const regex = new RegExp(skill, 'i');

      // find users who list the skill
      const usersWithSkill = await User.find({ skills: skill }).select("_id");
      const userIds = usersWithSkill.map(u => u._id);

      const orClauses = [{ serviceType: regex }, { description: regex }];
      if (userIds.length) orClauses.push({ user: { $in: userIds } });

      filter = { $or: orClauses };
    }

    if (status) {
      filter.status = status;
    }

    // pagination
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const total = await ServiceRequest.countDocuments(filter);
    let sortObj = { createdAt: -1 };
    if (sort) {
      const [f, order] = sort.split(":");
      sortObj = { [f]: order === 'asc' ? 1 : -1 };
    }

    const requests = await ServiceRequest.find(filter)
      .populate("user", "username email role")
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    res.json({ success: true, total, page, totalPages: Math.ceil(total / limit), count: requests.length, requests });
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
