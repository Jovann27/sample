import User from "../models/userSchema.js";
import JobFair from "../models/jobFairSchema.js";
import ServiceRequest from "../models/serviceSchema.js"; // ✅ Add this import

// ✅ Fetch all skilled users
export const getSkilledUsers = async (req, res) => {
  try {
    const workers = await User.find({ role: "Service Provider", verified: true })
      .select("firstName lastName skills availability profilePic createdAt");
    res.json({ success: true, count: workers.length, workers });
  } catch (err) {
    console.error("❌ Error fetching skilled users:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Fetch latest job fair
export const getJobFair = async (req, res) => {
  try {
    const jobfair = await JobFair.findOne().sort({ createdAt: -1 });
    if (!jobfair)
      return res.status(404).json({ success: false, message: "No job fair found" });
    res.json({ success: true, jobfair });
  } catch (err) {
    console.error("❌ Error fetching job fair:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Fetch all service requests
export const getAllRequests = async (req, res) => {
  try {
    const { skill, status, sort } = req.query;
    let filter = {};

    // 🔹 Skill filter (optional)
    if (skill) {
      const regex = new RegExp(skill, "i"); // case-insensitive match
      const usersWithSkill = await User.find({ skills: { $regex: regex } }).select("_id");
      const userIds = usersWithSkill.map(u => u._id);

      const orClauses = [
        { serviceType: regex },
        { description: regex },
        { user: { $in: userIds } }
      ];
      filter = { $or: orClauses };
    }

    // 🔹 Status filter (optional)
    if (status) {
      filter.status = status.toLowerCase();
    }

    // 🔹 Pagination
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    // 🔹 Sorting
    let sortObj = { createdAt: -1 };
    if (sort) {
      const [f, order] = sort.split(":");
      sortObj = { [f]: order === "asc" ? 1 : -1 };
    }

    // 🔹 Fetch requests from DB
    const total = await ServiceRequest.countDocuments(filter);
    const requests = await ServiceRequest.find(filter)
      .populate("user", "firstName lastName email role") // ✅ matches your schema
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    // ✅ Send proper JSON structure
    res.json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      count: requests.length,
      requests,
    });
  } catch (err) {
    console.error("❌ Error fetching service requests:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Accept a service request
export const updateServiceRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await ServiceRequest.findById(id);
    if (!request)
      return res.status(404).json({ success: false, message: "Service request not found" });

    request.status = "accepted";
    await request.save();

    res.json({ success: true, message: "Service request accepted", request });
  } catch (err) {
    console.error("❌ Error updating service request:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
